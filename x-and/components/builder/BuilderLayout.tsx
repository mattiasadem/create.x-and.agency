import React, { useEffect, useRef } from 'react';
import { useBuilderStore } from './store/useBuilderStore';
// We will implement these next
import ChatPanel from './ChatPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import clsx from 'clsx';

import PreviewFrame from './preview/PreviewFrame';
import CodeEditor from './editor/CodeEditor';

import { GoogleGenAI, Chat } from "@google/genai";
import { AGENT_SYSTEM_PROMPT, runAgentLoop, AgentLoopResult } from '../../lib/agentLoop';
import { AgentResponse, ToolResult } from '../../lib/agentTools';

const WorkspaceArea = () => {
    const { view } = useBuilderStore();

    return (
        <div className="flex-1 bg-[#020405] relative overflow-hidden flex flex-col">
            {view === 'preview' && <PreviewFrame />}
            {view === 'code' && <CodeEditor />}
            {view === 'split' && (
                <div className="flex h-full">
                    <div className="w-1/2 border-r border-white/5">
                        <CodeEditor />
                    </div>
                    <div className="w-1/2">
                        <PreviewFrame />
                    </div>
                </div>
            )}
        </div>
    );
};

interface BuilderLayoutProps {
    initialPrompt?: string;
    onBack?: () => void;
}

const BuilderLayout: React.FC<BuilderLayoutProps> = ({ initialPrompt, onBack }) => {
    const {
        isSidebarOpen,
        toggleSidebar,
        addMessage,
        setMessages,
        isBuilding,
        setIsBuilding,
        files,
        setFiles,
        addStep,
        updateStep,
        steps,
        setSteps
    } = useBuilderStore();

    // Refs to hold the AI instance
    const aiRef = useRef<GoogleGenAI | null>(null);
    const initializedRef = useRef(false);

    // Initialize Gemini AI
    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        try {
            // Using the API key from environment variable
            const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "";
            if (apiKey) {
                const ai = new GoogleGenAI({ apiKey });
                aiRef.current = ai;
            } else {
                console.error("No API Key found for Gemini");
                addMessage({
                    id: 'system-error',
                    role: 'assistant',
                    content: "Configuration Error: No Gemini API Key found. Please add VITE_GEMINI_API_KEY to your .env file.",
                    timestamp: new Date()
                });
            }
        } catch (error) {
            console.error("Failed to initialize Gemini:", error);
        }

        if (initialPrompt) {
            handleSendMessage(initialPrompt);
        } else {
            setMessages([{
                id: '0',
                role: 'assistant',
                content: "Hello! I'm x-and. Describe what you want to build, and I'll create it on the canvas.",
                timestamp: new Date()
            }]);
        }
    }, [initialPrompt]); // Run when initialPrompt changes (usually once) or mount

    /**
     * Update build steps based on agent progress
     */
    const updateBuildSteps = (step: number, response: AgentResponse, _toolResults: ToolResult[]) => {
        const stepLabel = response.notes || `Step ${step + 1}: ${response.status}`;

        // Update the steps in the global store
        // We use the store's setSteps to append or update
        // Since step ID matches index, we can just rebuild the array or add
        const currentSteps = useBuilderStore.getState().steps;
        const existingStepIndex = currentSteps.findIndex(s => s.id === step + 1);

        const newStep = {
            id: step + 1,
            label: stepLabel,
            thoughts: response.plan,
            status: 'active' as const
        };

        // Mark previous as complete
        const updatedSteps = currentSteps.map(s =>
            s.id < step + 1 ? { ...s, status: 'complete' as const } : s
        );

        if (existingStepIndex >= 0) {
            updatedSteps[existingStepIndex] = newStep;
        } else {
            updatedSteps.push(newStep);
        }

        setSteps(updatedSteps);
    };

    const handleSendMessage = async (content: string) => {
        const userMsg = {
            id: Date.now().toString(),
            role: 'user' as const,
            content,
            timestamp: new Date()
        };

        addMessage(userMsg);
        setIsBuilding(true);
        // Clear previous steps or start new task
        setSteps([{ id: 0, label: 'Initializing Agent...', status: 'active' }]);

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
                files, // Pass existing files for context
                {
                    maxSteps: 25,
                    onStepComplete: updateBuildSteps,
                    onStatusChange: (status) => {
                        // Optional: could update a status indicator in UI
                        console.log("Agent Status:", status);
                    }
                }
            );

            console.log("Agent Loop Result:", result);

            // Update project files from agent result
            if (result.files && Object.keys(result.files).length > 0) {
                // Normalize paths and update files
                const normalizedFiles: Record<string, string> = {};
                const keys = Object.keys(result.files);

                // DEBUG: Log file count
                console.log(`[BuilderLayout] Received ${keys.length} files from agent`);

                Object.entries(result.files).forEach(([path, content]) => {
                    let cleanPath = path.trim();
                    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;

                    // Normalize App paths similar to original builder
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

                setFiles({ ...files, ...normalizedFiles });
            } else {
                console.warn("[BuilderLayout] No files returned from agent loop");
            }
            // Generate response message
            let responseText: string;
            if (result.success) {
                const fileCount = result.files ? Object.keys(result.files).length : 0;
                responseText = result.finalResponse?.notes ||
                    `✓ Task completed in ${result.steps} step(s). Generated ${fileCount} files. Check the preview on the right.`;

                if (fileCount === 0) {
                    responseText += "\n\nWARNING: No files were returned by the agent. The preview may be empty.";
                }
            } else {
                responseText = result.error ||
                    `Task could not be completed. ${result.finalResponse?.notes || ''}`;
            }

            addMessage({
                id: Date.now().toString(),
                role: 'assistant',
                content: responseText,
                timestamp: new Date()
            });

        } catch (error) {
            console.error("Error in agent loop:", error);
            addMessage({
                id: Date.now().toString(),
                role: 'assistant',
                content: "Sorry, I encountered an error during generation. Please try again.",
                timestamp: new Date()
            });
        } finally {
            setIsBuilding(false);
        }
    };

    return (
        <div className="h-screen w-full bg-[#020405] flex overflow-hidden font-sans text-white">
            <AnimatePresence mode='wait'>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ x: -320, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -320, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-[400px] border-r border-white/5 flex flex-col bg-[#0a0f14] relative z-20 shrink-0"
                    >
                        <ChatPanel
                            messages={useBuilderStore.getState().messages}
                            onSendMessage={handleSendMessage}
                            onBack={onBack || (() => { })}
                            isGenerating={isBuilding}
                            agentStatus="building"
                            steps={steps}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col relative min-w-0">
                {/* Toggle Sidebar Button */}
                <button
                    onClick={toggleSidebar}
                    className={clsx(
                        "absolute top-4 z-50 p-2 rounded-lg bg-[#0a0f14] border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200",
                        isSidebarOpen ? "left-4" : "left-4"
                    )}
                >
                    {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                </button>

                <WorkspaceArea />
            </div>
        </div>
    );
};

export default BuilderLayout;
