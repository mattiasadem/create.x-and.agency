import React from 'react';
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackFileExplorer } from "@codesandbox/sandpack-react";
import { useBuilderStore } from '../store/useBuilderStore';
import { SHADCN_TEMPLATES } from '../../../lib/shadcnTemplates';

const CodeEditor: React.FC = () => {
    const { files } = useBuilderStore();

    // Same file transformation as PreviewFrame
    const sandpackFiles = React.useMemo(() => {
        const finalFiles: Record<string, any> = { ...SHADCN_TEMPLATES };

        Object.entries(files).forEach(([path, content]) => {
            const safePath = path.startsWith('/') ? path : `/${path}`;
            finalFiles[safePath] = { code: content };
        });

        // Ensure we have at least one file to prevent crashes
        if (!finalFiles['/src/App.tsx']) {
            finalFiles['/src/App.tsx'] = { code: '// No code generated yet' };
        }

        return finalFiles;
    }, [files]);

    return (
        <div className="h-full w-full bg-[#0a0f14] flex flex-col">
            <SandpackProvider
                template="vite-react-ts"
                theme="dark"
                files={sandpackFiles}
                options={{
                    classes: {
                        "sp-layout": "!h-full !flex-row",
                        "sp-wrapper": "!h-full",
                    }
                }}
            >
                <SandpackLayout className="!h-full !border-none !rounded-none !bg-transparent">
                    <SandpackFileExplorer
                        className="!bg-[#0a0f14] !border-r !border-white/5 !h-full"
                        style={{ height: '100%', minWidth: '200px' }}
                    />
                    <SandpackCodeEditor
                        showTabs
                        showLineNumbers
                        showInlineErrors
                        wrapContent
                        closableTabs
                        className="!bg-[#0a0f14] !h-full"
                        style={{ height: '100%', flex: 1 }}
                    />
                </SandpackLayout>
            </SandpackProvider>
        </div>
    );
};

export default CodeEditor;
