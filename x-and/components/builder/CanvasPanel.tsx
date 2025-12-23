import React, { ReactNode, useState } from 'react';
import { Smartphone, Monitor, Code, Maximize2, XCircle, Cpu, Scan, Download, Share2, MoreHorizontal, Layers, Image as ImageIcon, Eye, FileCode } from 'lucide-react';
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview, SandpackFileExplorer } from "@codesandbox/sandpack-react";
import { CanvasFeedItem } from './BuilderView';

export interface BuildStep {
    id: number;
    label: string;
    status: 'pending' | 'active' | 'complete';
}

interface CanvasPanelProps {
    isBuilding?: boolean;
    steps?: BuildStep[];
    files?: Record<string, string>;
    feed?: CanvasFeedItem[];
}

interface ErrorBoundaryProps {
    children?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

// 1. Explicitly define the entry points to guarantee wiring works
const DEPENDENCY_FILES = {
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

body {
  background: #020405;
  color: white;
}`,
    "/src/App.tsx": `import React from 'react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#020405] text-white flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 mx-auto border border-cyan-500/30 rounded-full flex items-center justify-center">
            <div className="absolute inset-0 border border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="text-cyan-400 text-2xl font-bold font-mono">x</div>
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-white/90 tracking-wide">Ready to Build</h1>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            Describe what you want to create in the chat panel and watch it come to life.
          </p>
        </div>
      </div>
    </div>
  );
}`
};

class SandpackErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(error: any): ErrorBoundaryState {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8 text-center bg-[#05080a] rounded-lg border border-white/5">
                    <XCircle className="w-10 h-10 text-red-500/50 mb-4" />
                    <h3 className="text-white font-medium mb-2 font-display">Preview Unavailable</h3>
                    <p className="text-xs text-gray-500 max-w-md">
                        Runtime error encountered. Review the code to fix syntax issues.
                    </p>
                </div>
            );
        }
        return (this as any).props.children;
    }
}

const CreatingLoader = () => (
    <div className="relative w-full max-w-md mx-auto p-8 rounded-2xl bg-[#0a0f14]/80 border border-white/5 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center animate-fade-in">
        <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 rounded-full border-t border-l border-cyan-500/50 animate-[spin_2s_linear_infinite]"></div>
            <div className="absolute inset-2 rounded-full border-r border-b border-purple-500/50 animate-[spin_3s_linear_infinite_reverse]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-full animate-pulse flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                    <Scan className="text-cyan-400 w-6 h-6" />
                </div>
            </div>
        </div>

        <div className="text-center space-y-2">
            <h3 className="text-2xl font-display font-bold text-white tracking-[0.2em] uppercase animate-pulse">Creating...</h3>
            <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto opacity-50"></div>
            <p className="text-cyan-400/60 text-xs font-mono">Synthesizing pixels & logic</p>
        </div>
    </div>
);

const FeedCard: React.FC<{ item: CanvasFeedItem; files?: Record<string, string> }> = ({ item, files }) => {
    const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

    const isPreview = item.type === 'preview';

    // Transform files for Sandpack
    const sandpackFiles = React.useMemo(() => {
        // Base config with our forced entry points
        const finalFiles: Record<string, any> = { ...DEPENDENCY_FILES };

        if (files) {
            Object.entries(files).forEach(([path, content]) => {
                // Ensure absolute paths
                const safePath = path.startsWith('/') ? path : `/${path}`;

                finalFiles[safePath] = {
                    code: content,
                    active: safePath === '/src/App.tsx'
                };
            });
        }

        return finalFiles;
    }, [files]);

    return (
        <div className={`w-full bg-[#0a0f14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl mb-6 animate-slide-up transform transition-all hover:border-white/20 flex flex-col ${isPreview ? 'h-[calc(100vh-100px)]' : ''}`}>
            <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-[#0f161e] shrink-0">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${item.type === 'preview' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-purple-500/10 text-purple-400'}`}>
                        {item.type === 'preview' ? <Code size={16} /> : <ImageIcon size={16} />}
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-white tracking-wide">{item.title}</h3>
                        <span className="text-[10px] text-gray-500 font-mono">
                            {item.type === 'preview' ? 'Interactive App' : 'Generated Asset'} • {new Date().toLocaleTimeString()}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {item.type === 'preview' && (
                        <div className="flex items-center bg-[#05080a] p-1 rounded-lg border border-white/5">
                            <button
                                onClick={() => setViewMode('preview')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'preview'
                                        ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                                        : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                <Eye size={12} />
                                Preview
                            </button>
                            <button
                                onClick={() => setViewMode('code')}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${viewMode === 'code'
                                        ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                                        : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                <FileCode size={12} />
                                Code
                            </button>
                        </div>
                    )}

                    <div className="h-4 w-[1px] bg-white/10"></div>

                    <div className="flex items-center gap-1">
                        <button className="p-2 text-gray-500 hover:text-white transition-colors hover:bg-white/5 rounded-full">
                            <Download size={14} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-white transition-colors hover:bg-white/5 rounded-full">
                            <Share2 size={14} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-white transition-colors hover:bg-white/5 rounded-full">
                            <MoreHorizontal size={14} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative bg-[#05080a] flex-1 overflow-hidden">
                {item.type === 'preview' && files ? (
                    <div className="h-full w-full">
                        <SandpackErrorBoundary>
                            <SandpackProvider
                                template="vite-react-ts"
                                theme="dark"
                                files={sandpackFiles}
                                options={{
                                    externalResources: ["https://cdn.tailwindcss.com"],
                                    classes: {
                                        "sp-layout": "!h-full !block md:!flex",
                                        "sp-wrapper": "!h-full",
                                    }
                                }}
                                customSetup={{
                                    dependencies: {
                                        "lucide-react": "latest",
                                        "clsx": "latest",
                                        "tailwind-merge": "latest",
                                        "framer-motion": "latest"
                                    }
                                }}
                            >
                                <SandpackLayout className="!h-full !border-none !rounded-none !bg-transparent">
                                    {viewMode === 'code' ? (
                                        <>
                                            <SandpackFileExplorer
                                                className="!bg-[#0a0f14]/50 !border-r !border-white/5 backdrop-blur-sm"
                                                style={{ height: '100%', width: '250px' }}
                                            />
                                            <SandpackCodeEditor
                                                showTabs
                                                showLineNumbers
                                                showInlineErrors
                                                wrapContent
                                                closableTabs
                                                className="!bg-[#05080a]/80 !h-full"
                                                style={{ height: '100%', flex: 1 }}
                                            />
                                        </>
                                    ) : (
                                        <SandpackPreview
                                            className="!h-full !bg-[#05080a]"
                                            showNavigator={true}
                                            showOpenInCodeSandbox={false}
                                            style={{ height: '100%', flex: 1 }}
                                        />
                                    )}
                                </SandpackLayout>
                            </SandpackProvider>
                        </SandpackErrorBoundary>
                    </div>
                ) : (
                    <div className="p-8 flex items-center justify-center h-full">
                        <img src={item.content} alt={item.title} className="max-w-full max-h-full rounded-lg shadow-lg border border-white/5" />
                    </div>
                )}
            </div>
        </div>
    );
}

const CanvasPanel: React.FC<CanvasPanelProps> = ({ isBuilding = false, steps = [], files = {}, feed = [] }) => {
    const hasItems = feed && feed.length > 0;

    return (
        <div className="flex-1 flex flex-col h-full bg-[#020405] relative overflow-hidden font-sans">

            <div className="flex-1 relative bg-[#05080a] overflow-hidden flex flex-col">
                <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full pointer-events-none"></div>

                <div
                    className="fixed inset-0 opacity-[0.03] pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: '40px 40px'
                    }}
                ></div>

                {isBuilding && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#020405]/60 backdrop-blur-sm transition-all duration-500">
                        <CreatingLoader />
                    </div>
                )}

                <div className="relative z-10 w-full h-full px-4 pt-4 overflow-y-auto custom-scrollbar">
                    {hasItems ? (
                        <div className="flex flex-col gap-6 min-h-full">
                            {feed.map((item) => (
                                <FeedCard key={item.id} item={item} files={files} />
                            ))}
                        </div>
                    ) : !isBuilding && (
                        <div className="flex flex-col items-center justify-center h-full opacity-40">
                            <div className="w-32 h-32 border border-white/5 rounded-full flex items-center justify-center relative">
                                <div className="absolute inset-0 border border-cyan-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                <div className="absolute inset-2 border border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                                <Cpu className="text-cyan-500/40 w-12 h-12" />
                            </div>
                            <div className="mt-6 text-center">
                                <div className="text-sm font-display tracking-widest text-white/40 uppercase">Canvas Empty</div>
                                <div className="text-[10px] font-mono text-cyan-500/30 mt-1">Describe a project to begin generation</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CanvasPanel;