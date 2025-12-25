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

        console.log(`[deploy-vercel] Publishing project for sandbox ${sandboxId}...`);

        const sandbox = await sandboxManager.getOrCreateProvider(sandboxId);

        if (!sandbox) {
            return NextResponse.json({
                success: false,
                error: 'Sandbox not found or could not be reconnected'
            }, { status: 404 });
        }

        // Call publish on the provider
        const result = await sandbox.publish();

        return NextResponse.json({
            success: true,
            url: result.url,
            inspectUrl: result.inspectUrl,
            message: 'Project published successfully'
        });

    } catch (error) {
        console.error('[deploy-vercel] Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: (error as Error).message
            },
            { status: 500 }
        );
    }
}
