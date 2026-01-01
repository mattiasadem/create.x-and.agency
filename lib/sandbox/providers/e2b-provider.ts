import { Sandbox } from '@e2b/code-interpreter';
import { SandboxProvider, SandboxInfo, CommandResult } from '../types';
// SandboxProviderConfig available through parent class
import { appConfig } from '@/config/app.config';

export class E2BProvider extends SandboxProvider {
  private existingFiles: Set<string> = new Set();

  /**
   * Attempt to reconnect to an existing E2B sandbox
   */
  async reconnect(sandboxId: string): Promise<boolean> {
    try {
      // Try to connect to existing sandbox
      this.sandbox = await Sandbox.connect(sandboxId);

      const host = (this.sandbox as any).getHost(appConfig.e2b.vitePort);

      this.sandboxInfo = {
        sandboxId,
        url: `https://${host}`,
        provider: 'e2b',
        createdAt: new Date() // We don't know the original creation time, so using now
      };

      // Set extended timeout if available
      if (typeof this.sandbox.setTimeout === 'function') {
        this.sandbox.setTimeout(appConfig.e2b.timeoutMs);
      }

      return true;
    } catch (error) {
      console.error(`[E2BProvider] Failed to reconnect to sandbox ${sandboxId}:`, error);
      return false;
    }
  }

  async createSandbox(): Promise<SandboxInfo> {
    try {

      // Kill existing sandbox if any
      if (this.sandbox) {
        try {
          await this.sandbox.kill();
        } catch (e) {
          console.error('Failed to close existing sandbox:', e);
        }
        this.sandbox = null;
      }

      // Clear existing files tracking
      this.existingFiles.clear();

      // Create base sandbox
      this.sandbox = await Sandbox.create({
        apiKey: this.config.e2b?.apiKey || process.env.E2B_API_KEY,
        timeoutMs: this.config.e2b?.timeoutMs || appConfig.e2b.timeoutMs
      });

      const sandboxId = (this.sandbox as any).sandboxId || Date.now().toString();
      const host = (this.sandbox as any).getHost(appConfig.e2b.vitePort);


      this.sandboxInfo = {
        sandboxId,
        url: `https://${host}`,
        provider: 'e2b',
        createdAt: new Date()
      };

      // Set extended timeout on the sandbox instance if method available
      if (typeof this.sandbox.setTimeout === 'function') {
        this.sandbox.setTimeout(appConfig.e2b.timeoutMs);
      }

      return this.sandboxInfo;

    } catch (error) {
      console.error('[E2BProvider] Error creating sandbox:', error);
      throw error;
    }
  }

  async runCommand(command: string): Promise<CommandResult> {
    if (!this.sandbox) {
      throw new Error('No active sandbox');
    }


    const result = await this.sandbox.runCode(`
      import subprocess
      import os

      os.chdir('/home/user/app')
      result = subprocess.run(${JSON.stringify(command.split(' '))}, 
                            capture_output=True, 
                            text=True, 
                            shell=False)

      print("STDOUT:")
      print(result.stdout)
      if result.stderr:
          print("\\nSTDERR:")
          print(result.stderr)
      print(f"\\nReturn code: {result.returncode}")
    `);

    const output = result.logs.stdout.join('\n');
    const stderr = result.logs.stderr.join('\n');

    return {
      stdout: output,
      stderr,
      exitCode: result.error ? 1 : 0,
      success: !result.error
    };
  }

  async writeFile(path: string, content: string): Promise<void> {
    if (!this.sandbox) {
      throw new Error('No active sandbox');
    }

    const fullPath = path.startsWith('/') ? path : `/home/user/app/${path}`;

    // Use the E2B filesystem API to write the file
    // Note: E2B SDK uses files.write() method
    if ((this.sandbox as any).files && typeof (this.sandbox as any).files.write === 'function') {
      // Use the files.write API if available
      await (this.sandbox as any).files.write(fullPath, Buffer.from(content));
    } else {
      // Fallback to Python code execution
      await this.sandbox.runCode(`
        import os

        # Ensure directory exists
        dir_path = os.path.dirname("${fullPath}")
        os.makedirs(dir_path, exist_ok=True)

        # Write file
        with open("${fullPath}", 'w') as f:
            f.write(${JSON.stringify(content)})
        print(f"✓ Written: ${fullPath}")
      `);
    }

    this.existingFiles.add(path);
  }

  async readFile(path: string): Promise<string> {
    if (!this.sandbox) {
      throw new Error('No active sandbox');
    }

    const fullPath = path.startsWith('/') ? path : `/home/user/app/${path}`;

    const result = await this.sandbox.runCode(`
      with open("${fullPath}", 'r') as f:
          content = f.read()
      print(content)
    `);

    return result.logs.stdout.join('\n');
  }

  async listFiles(directory: string = '/home/user/app'): Promise<string[]> {
    if (!this.sandbox) {
      throw new Error('No active sandbox');
    }

    const result = await this.sandbox.runCode(`
      import os
      import json

      def list_files(path):
          files = []
          for root, dirs, filenames in os.walk(path):
              # Skip node_modules and .git
              dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.next', 'dist', 'build']]
              for filename in filenames:
                  rel_path = os.path.relpath(os.path.join(root, filename), path)
                  files.append(rel_path)
          return files

      files = list_files("${directory}")
      print(json.dumps(files))
    `);

    try {
      return JSON.parse(result.logs.stdout.join(''));
    } catch {
      return [];
    }
  }

  async installPackages(packages: string[]): Promise<CommandResult> {
    if (!this.sandbox) {
      throw new Error('No active sandbox');
    }

    const packageList = packages.join(' ');
    const flags = appConfig.packages.useLegacyPeerDeps ? '--legacy-peer-deps' : '';


    const result = await this.sandbox.runCode(`
      import subprocess
      import os

      os.chdir('/home/user/app')

      # Install packages
      result = subprocess.run(
          ['npm', 'install', ${flags ? `'${flags}',` : ''} ${packages.map(p => `'${p}'`).join(', ')}],
          capture_output=True,
          text=True
      )

      print("STDOUT:")
      print(result.stdout)
      if result.stderr:
          print("\\nSTDERR:")
          print(result.stderr)
      print(f"\\nReturn code: {result.returncode}")
    `);

    const output = result.logs.stdout.join('\n');
    const stderr = result.logs.stderr.join('\n');

    // Restart Vite if configured
    if (appConfig.packages.autoRestartVite && !result.error) {
      await this.restartViteServer();
    }

    return {
      stdout: output,
      stderr,
      exitCode: result.error ? 1 : 0,
      success: !result.error
    };
  }

  async setupViteApp(): Promise<void> {
    if (!this.sandbox) {
      throw new Error('No active sandbox');
    }


    // Write all files in a single Python script
    const setupScript = `
import os
import json

print('Setting up React app with Vite and Tailwind...')

# Create directory structure
os.makedirs('/home/user/app/src', exist_ok=True)

# Package.json
package_json = {
    "name": "sandbox-app",
    "version": "1.0.0",
    "type": "module",
    "scripts": {
        "dev": "vite --host",
        "build": "vite build",
        "preview": "vite preview"
    },
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
    },
    "devDependencies": {
        "@vitejs/plugin-react": "^4.0.0",
        "vite": "^4.3.9",
        "tailwindcss": "^3.3.0",
        "postcss": "^8.4.31",
        "autoprefixer": "^10.4.16"
    }
}

with open('/home/user/app/package.json', 'w') as f:
    json.dump(package_json, f, indent=2)
print('✓ package.json')

# Vite config
vite_config = """import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: false,
    allowedHosts: ['.e2b.app', '.e2b.dev', '.vercel.run', 'localhost', '127.0.0.1']
  }
})"""

with open('/home/user/app/vite.config.js', 'w') as f:
    f.write(vite_config)
print('✓ vite.config.js')

# Tailwind config
tailwind_config = """/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}"""

with open('/home/user/app/tailwind.config.js', 'w') as f:
    f.write(tailwind_config)
print('✓ tailwind.config.js')

# PostCSS config
postcss_config = """export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}"""

with open('/home/user/app/postcss.config.js', 'w') as f:
    f.write(postcss_config)
print('✓ postcss.config.js')

# Index.html
index_html = """<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sandbox App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>"""

with open('/home/user/app/index.html', 'w') as f:
    f.write(index_html)
print('✓ index.html')

# Main.jsx
main_jsx = """import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)"""

with open('/home/user/app/src/main.jsx', 'w') as f:
    f.write(main_jsx)
print('✓ src/main.jsx')

# App.jsx
app_jsx = """function App() {
  return (
    <div className="min-h-screen bg-[#020405] text-white flex items-center justify-center p-4">
    </div>
  )
}

export default App"""

with open('/home/user/app/src/App.jsx', 'w') as f:
    f.write(app_jsx)
print('✓ src/App.jsx')

# Index.css
index_css = """@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background-color: rgb(17 24 39);
}"""

with open('/home/user/app/src/index.css', 'w') as f:
    f.write(index_css)
print('✓ src/index.css')

print('\\nAll files created successfully!')
`;

    await this.sandbox.runCode(setupScript);

    // Install dependencies
    await this.sandbox.runCode(`
import subprocess

print('Installing npm packages...')
result = subprocess.run(
    ['npm', 'install'],
    cwd='/home/user/app',
    capture_output=True,
    text=True
)

if result.returncode == 0:
    print('✓ Dependencies installed successfully')
else:
    print(f'⚠ Warning: npm install had issues: {result.stderr}')
    `);

    // Start Vite dev server
    await this.sandbox.runCode(`
import subprocess
import os
import time

os.chdir('/home/user/app')

# Kill any existing Vite processes
subprocess.run(['pkill', '-f', 'vite'], capture_output=True)
time.sleep(1)

# Start Vite dev server
env = os.environ.copy()
env['FORCE_COLOR'] = '0'

process = subprocess.Popen(
    ['npm', 'run', 'dev'],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    env=env
)

print(f'✓ Vite dev server started with PID: {process.pid}')
print('Waiting for server to be ready...')
    `);

    // Wait for Vite to be ready by checking the port
    await this.waitForServer(5173);

    // Track initial files
    this.existingFiles.add('src/App.jsx');
    this.existingFiles.add('src/main.jsx');
    this.existingFiles.add('src/index.css');
    this.existingFiles.add('index.html');
    this.existingFiles.add('package.json');
    this.existingFiles.add('vite.config.js');
    this.existingFiles.add('tailwind.config.js');
    this.existingFiles.add('postcss.config.js');
  }

  async waitForServer(port: number, timeoutMs: number = 60000): Promise<void> {
    if (!this.sandbox) {
      throw new Error('No active sandbox');
    }

    console.log(`[E2BProvider] Waiting for server on port ${port}...`);

    // Poll the server using a Python script that checks the socket
    const pollScript = `
import socket
import time
import sys

def check_port(port, timeout=60):
    start_time = time.time()
    while time.time() - start_time < timeout:
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(1)
                result = s.connect_ex(('localhost', port))
                if result == 0:
                    print(f"✓ Port {port} is open")
                    return True
        except Exception as e:
            pass
        time.sleep(0.5)
    
    print(f"✗ Timeout waiting for port {port}")
    sys.exit(1)

check_port(${port}, ${timeoutMs / 1000})
    `;

    try {
      await this.sandbox.runCode(pollScript);
      console.log(`[E2BProvider] Server is ready on port ${port}`);
    } catch (error) {
      console.error(`[E2BProvider] Failed to wait for server on port ${port}:`, error);
      throw new Error(`Timeout waiting for server on port ${port}`);
    }
  }

  async restartViteServer(): Promise<void> {
    if (!this.sandbox) {
      throw new Error('No active sandbox');
    }


    await this.sandbox.runCode(`
import subprocess
import time
import os

os.chdir('/home/user/app')

# Kill existing Vite process
subprocess.run(['pkill', '-f', 'vite'], capture_output=True)
time.sleep(2)

# Start Vite dev server
env = os.environ.copy()
env['FORCE_COLOR'] = '0'

process = subprocess.Popen(
    ['npm', 'run', 'dev'],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    env=env
)

print(f'✓ Vite restarted with PID: {process.pid}')
    `);

    // Wait for Vite to be ready by checking the port
    await this.waitForServer(5173);
  }

  getSandboxUrl(): string | null {
    return this.sandboxInfo?.url || null;
  }

  getSandboxInfo(): SandboxInfo | null {
    return this.sandboxInfo;
  }

  async terminate(): Promise<void> {
    if (this.sandbox) {
      try {
        await this.sandbox.kill();
      } catch (e) {
        console.error('Failed to terminate sandbox:', e);
      }
      this.sandbox = null;
      this.sandboxInfo = null;
    }
  }

  isAlive(): boolean {
    return !!this.sandbox;
  }

  async getDownloadUrl(path: string): Promise<string> {
    if (!this.sandbox) {
      throw new Error('No active sandbox');
    }

    const fullPath = path.startsWith('/') ? path : `/home/user/app/${path}`;

    // Use the downloadUrl method from E2B SDK
    if (typeof (this.sandbox as any).downloadUrl === 'function') {
      return await (this.sandbox as any).downloadUrl(fullPath);
    }

    throw new Error('Download URL generation not supported by this sandbox version');
  }

  async publish(): Promise<{ url: string; inspectUrl?: string }> {
    if (!this.sandbox) {
      throw new Error('No active sandbox');
    }

    const token = this.config.vercel?.token || process.env.VERCEL_TOKEN;
    if (!token) {
      throw new Error('VERCEL_TOKEN not found in environment or config');
    }

    const teamId = this.config.vercel?.teamId || process.env.VERCEL_TEAM_ID;

    // 1. List all files
    const files = await this.listFiles();
    const deploymentFiles = [];

    // 2. Read all files
    for (const filePath of files) {
      try {
        const content = await this.readFile(filePath);
        deploymentFiles.push({
          file: filePath,
          data: content
        });
      } catch (e) {
        console.warn(`[E2BProvider] Failed to read file ${filePath} for deployment, skipping:`, e);
      }
    }

    if (deploymentFiles.length === 0) {
      throw new Error('No files found to deploy');
    }

    // 3. Create deployment via Vercel API
    const url = `https://api.vercel.com/v12/deployments${teamId ? `?teamId=${teamId}` : ''}`;

    // Generate a unique name for the deployment or use existing one if already deployed
    // This allows updates to the same site instead of creating new ones
    let projectName = this.sandboxInfo?.deployedProjectName;
    if (!projectName) {
      projectName = `x-and-projects-${Math.random().toString(36).substring(2, 10)}`;
      if (this.sandboxInfo) {
        this.sandboxInfo.deployedProjectName = projectName;
      }
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: projectName,
        files: deploymentFiles,
        projectSettings: {
          framework: 'vite',
          buildCommand: 'npm run build',
          outputDirectory: 'dist'
        },
        target: 'production'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[E2BProvider] Vercel API Error:', errorData);
      throw new Error(`Vercel deployment failed: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const deploymentId = data.id;

    // Poll for deployment ready state
    // This ensures we wait for the build to finish before returning the URL
    try {
      let attempts = 0;
      const maxAttempts = 30; // 30 attempts * 2s = 60s max wait

      while (attempts < maxAttempts) {
        const statusRes = await fetch(`https://api.vercel.com/v13/deployments/${deploymentId}${teamId ? `?teamId=${teamId}` : ''}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.readyState === 'READY') {
            break;
          }
          if (statusData.readyState === 'ERROR') {
            throw new Error(`Vercel deployment status reported an error: ${statusData.error?.message || 'Unknown error'}`);
          }
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
        attempts++;
      }
    } catch (e) {
      console.warn('Failed to verify deployment status, continuing anyway:', e);
    }

    // Use the clean project alias which is automatically assigned for production deployments
    const cleanUrl = `${projectName}.vercel.app`;
    const fullUrl = `https://${cleanUrl}`;

    // Poll for readiness to avoid 404s on immediate redirect
    // Vercel new projects can take a few seconds to propagate DNS/routing
    try {
      let attempts = 0;
      const maxAttempts = 20; // 20 attempts * 500ms = 10s max wait

      while (attempts < maxAttempts) {
        try {
          const res = await fetch(fullUrl, { method: 'HEAD' });
          if (res.status === 200) {
            break;
          }
        } catch (e) {
          // Ignore network errors during polling
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
      }
    } catch (e) {
      console.warn('Failed to verify deployment readiness:', e);
    }

    return {
      url: fullUrl,
      inspectUrl: `https://vercel.com/${teamId || 'dashboard'}/deployments/${data.id}`
    };
  }
}