import React, { useState, useEffect, useRef, Suspense } from 'react';
import ChatPanel from './ChatPanel';
import { Message } from './store/useBuilderStore';
import { GoogleGenAI, Chat } from "@google/genai";
import { AGENT_SYSTEM_PROMPT, runAgentLoop, AgentLoopResult } from '../../lib/agentLoop';
import { AgentResponse, ToolResult } from '../../lib/agentTools';
import { Loader2 } from 'lucide-react';

// Lazy load CanvasPanel to isolate Sandpack/heavy dependencies
const CanvasPanel = React.lazy(() => import('./CanvasPanel'));

// Redefine locally to avoid import issues with lazy modules
interface BuildStep {
    id: number;
    label: string;
    thoughts?: string[];
    status: 'pending' | 'active' | 'complete';
}

export interface CanvasFeedItem {
    id: string;
    type: 'image' | 'preview';
    content: string; // Data URI for image, or 'app' for preview
    title: string;
    timestamp: Date;
}

interface BuilderViewProps {
    initialPrompt: string;
    onBack: () => void;
}

const BuilderView: React.FC<BuilderViewProps> = ({ initialPrompt, onBack }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isBuilding, setIsBuilding] = useState(false);
    const [buildSteps, setBuildSteps] = useState<BuildStep[]>([]);
    const [projectFiles, setProjectFiles] = useState<Record<string, string>>({});
    const [canvasFeed, setCanvasFeed] = useState<CanvasFeedItem[]>([]);
    const [agentStatus, setAgentStatus] = useState<string>('ready');

    // Refs to hold the AI instance
    const aiRef = useRef<GoogleGenAI | null>(null);
    const initializedRef = useRef(false);

    // Initialize Gemini AI
    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            aiRef.current = ai;
        } catch (error) {
            console.error("Failed to initialize Gemini:", error);
        }

        if (initialPrompt) {
            handleSendMessage(initialPrompt, true);
        } else {
            setMessages([{
                id: '0',
                role: 'assistant',
                content: "Hello! I'm x-and. Describe what you want to build, and I'll create it on the canvas.",
                timestamp: new Date()
            }]);
        }
    }, []); // Run once on mount

    /**
     * Update build steps based on agent progress
     */
    const updateBuildSteps = (step: number, response: AgentResponse, _toolResults: ToolResult[]) => {
        const stepLabel = response.notes || `Step ${step + 1}: ${response.status}`;

        setBuildSteps(prev => {
            // Mark previous steps as complete
            const updated = prev.map(s => ({ ...s, status: 'complete' as const }));

            // Add new step
            return [...updated, {
                id: step + 1,
                label: stepLabel,
                thoughts: response.plan,
                status: 'active' as const
            }];
        });
    };

    /**
     * Main message handler - now uses the agent loop
     */
    const handleSendMessage = async (content: string, isInitial = false) => {
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setIsBuilding(true);
        setBuildSteps([{ id: 0, label: 'Initializing Agent Loop...', status: 'active' }]);
        setAgentStatus('thinking');

        try {
            if (!aiRef.current) {
                throw new Error("AI not initialized");
            }

            // Create a fresh chat for each task with the agent system prompt
            const chat: Chat = aiRef.current.chats.create({
                model: 'gemini-2.0-flash',
                config: {
                    systemInstruction: AGENT_SYSTEM_PROMPT,
                },
            });

            // Run the agent loop
            const result: AgentLoopResult = await runAgentLoop(
                chat,
                content,
                projectFiles, // Pass existing files for context
                {
                    maxSteps: 25,
                    onStepComplete: updateBuildSteps,
                    onStatusChange: setAgentStatus
                }
            );

            console.log("Agent Loop Result:", result);

            // Update project files from agent result
            if (result.files && Object.keys(result.files).length > 0) {
                // Normalize paths and update files
                const normalizedFiles: Record<string, string> = {};
                Object.entries(result.files).forEach(([path, content]) => {
                    let cleanPath = path.trim();
                    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;

                    // Normalize App paths
                    const lowerPath = cleanPath.toLowerCase();
                    if (
                        lowerPath === '/app.tsx' ||
                        lowerPath === '/src/app.tsx' ||
                        lowerPath.endsWith('/app.tsx')
                    ) {
                        cleanPath = '/src/App.tsx';
                    }

                    normalizedFiles[cleanPath] = content;
                });

                setProjectFiles(prev => ({ ...prev, ...normalizedFiles }));

                // Ensure preview card exists
                setCanvasFeed(prev => {
                    if (prev.some(item => item.type === 'preview')) return prev;
                    return [{
                        id: 'preview-card',
                        type: 'preview',
                        content: 'app',
                        title: 'Interactive Preview',
                        timestamp: new Date()
                    }, ...prev];
                });
            }

            // Generate response message
            let responseText: string;
            if (result.success) {
                responseText = result.finalResponse?.notes ||
                    `✓ Task completed in ${result.steps} step(s). Check the preview on the right.`;
            } else {
                responseText = result.error ||
                    `Task could not be completed. ${result.finalResponse?.notes || ''}`;
            }

            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: responseText,
                timestamp: new Date()
            }]);

        } catch (error) {
            console.error("Error in agent loop:", error);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date()
            }]);
        } finally {
            setIsBuilding(false);
            setBuildSteps([]);
            setAgentStatus('ready');
        }
    };

    return (
        <div className="h-screen w-full bg-[#020405] flex overflow-hidden font-sans">
            <div className="w-[400px] border-r border-white/5 flex flex-col bg-[#0a0f14]">
                <ChatPanel
                    messages={messages}
                    onSendMessage={(text) => handleSendMessage(text)}
                    onBack={onBack}
                    isGenerating={isBuilding}
                    agentStatus={agentStatus}
                    steps={buildSteps}
                />
            </div>

            <div className="flex-1 bg-[#020405] relative flex flex-col">
                {/* Agent Status Badge */}
                {isBuilding && (
                    <div className="absolute top-4 left-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-[#0a0f14] border border-cyan-500/30 rounded-full text-xs">
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        <span className="text-cyan-400 font-mono capitalize">{agentStatus}</span>
                    </div>
                )}

                <Suspense fallback={
                    <div className="flex-1 flex items-center justify-center bg-[#020405] text-cyan-500">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin w-8 h-8" />
                            <span className="text-sm font-mono text-gray-500">Initializing Feed...</span>
                        </div>
                    </div>
                }>
                    <CanvasPanel
                        isBuilding={isBuilding}
                        steps={buildSteps}
                        files={projectFiles}
                        feed={canvasFeed}
                    />
                </Suspense>
            </div>
        </div>
    );
};

export default BuilderView;