import React from 'react';
import { SandpackProvider, SandpackLayout, SandpackPreview } from "@codesandbox/sandpack-react";
import { useBuilderStore } from '../store/useBuilderStore';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { SHADCN_TEMPLATES } from '../../../lib/shadcnTemplates';

// We define the HTML and base CSS here
// Note: We are using a simple string for the HTML to avoid parsing issues
const DEPENDENCY_FILES = {
    "/vite.config.ts": `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})`,
    "/tsconfig.json": `{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,
    "/index.html": `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>App</title>
    </head>
    <body>
        <div id="root"></div>
        <script type="module" src="/src/main.tsx"></script>
    </body>
</html>`,
    "/src/main.tsx": `import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);`,
    "/src/index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;

    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;

    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;

    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;

    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;

    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;

    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
`
};

const PreviewFrame: React.FC = () => {
    const { files, isBuilding } = useBuilderStore();

    // Merge store files with dependency files and Shadcn templates
    const sandpackFiles = React.useMemo(() => {
        const finalFiles: Record<string, any> = {
            ...DEPENDENCY_FILES,
            ...SHADCN_TEMPLATES
        };

        Object.entries(files).forEach(([path, content]) => {
            // Ensure absolute paths
            const safePath = path.startsWith('/') ? path : `/${path}`;

            // Basic simple logic to determine active file
            const isActive = safePath === '/src/App.tsx';

            finalFiles[safePath] = {
                code: content,
                active: isActive
            };
        });

        // If no App.tsx, provide a default one to prevent crash
        if (!finalFiles['/src/App.tsx']) {
            finalFiles['/src/App.tsx'] = {
                code: `export default function App() { return <div className="p-10 text-center">Initialized</div> }`
            }
        }

        return finalFiles;
    }, [files]);

    return (
        <div className="h-full w-full bg-[#020405] relative flex flex-col">
            {/* Loading Overlay */}
            {isBuilding && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-[#020405]/80 backdrop-blur-sm flex items-center justify-center"
                >
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 animate-[spin_3s_linear_infinite]"></div>
                            <div className="w-12 h-12 rounded-full border-t-2 border-cyan-500 absolute inset-0 animate-spin"></div>
                        </div>
                        <span className="text-cyan-500 font-mono text-sm animate-pulse">Generating...</span>
                    </div>
                </motion.div>
            )}

            <div className="flex-1 h-full w-full">
                <SandpackProvider
                    template="vite-react-ts"
                    theme="dark"
                    files={sandpackFiles}
                    options={{
                        externalResources: ["https://cdn.tailwindcss.com"],
                        classes: {
                            "sp-layout": "!h-full !block",
                            "sp-wrapper": "!h-full",
                        }
                    }}
                    customSetup={{
                        dependencies: {
                            "lucide-react": "latest",
                            "clsx": "latest",
                            "tailwind-merge": "latest",
                            "framer-motion": "latest",
                            "date-fns": "latest",
                            "class-variance-authority": "latest",
                            "@radix-ui/react-slot": "latest",
                            "react-router-dom": "latest"
                        }
                    }}
                >
                    <SandpackLayout className="!h-full !border-none !rounded-none !bg-transparent">
                        <SandpackPreview
                            className="!h-full !bg-[#020405]"
                            showNavigator={true}
                            showOpenInCodeSandbox={false}
                            style={{ height: '100%' }}
                        />
                    </SandpackLayout>
                </SandpackProvider>
            </div>
        </div>
    );
};

export default PreviewFrame;
