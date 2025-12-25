import { NextResponse } from 'next/server';
import { sandboxManager } from '@/lib/sandbox/sandbox-manager';

export async function POST(req: Request) {
  try {
    const { sandboxId } = await req.json();

    if (!sandboxId) {
      return NextResponse.json({
        success: false,
        error: 'No sandbox ID provided'
      }, { status: 400 });
    }

    console.log(`[create-zip] Creating project zip for sandbox ${sandboxId}...`);

    const sandbox = await sandboxManager.getOrCreateProvider(sandboxId);

    if (!sandbox) {
      return NextResponse.json({
        success: false,
        error: 'Sandbox not found or could not be reconnected'
      }, { status: 404 });
    }

    // Create zip file in sandbox
    const zipCommand = 'zip -r /tmp/project.zip . -x "node_modules/*" ".git/*" ".next/*" "dist/*" "build/*" "*.log"';
    const zipResult = await sandbox.runCommand(zipCommand);

    if (zipResult.exitCode !== 0) {
      throw new Error(`Failed to create zip: ${zipResult.stderr || 'Unknown error'}`);
    }

    // Get file size for logging
    const sizeResult = await sandbox.runCommand('ls -la /tmp/project.zip | awk \'{print $5}\'');
    console.log(`[create-zip] Created project.zip (${sizeResult.stdout.trim()} bytes)`);

    // Generate secure download URL
    console.log('[create-zip] Generating download URL...');
    const downloadUrl = await sandbox.getDownloadUrl('/tmp/project.zip');

    return NextResponse.json({
      success: true,
      dataUrl: downloadUrl, // Keeping key 'dataUrl' to match frontend expectation, though it's now a real URL
      fileName: 'project.zip',
      message: 'Zip file created successfully'
    });

  } catch (error) {
    console.error('[create-zip] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
}