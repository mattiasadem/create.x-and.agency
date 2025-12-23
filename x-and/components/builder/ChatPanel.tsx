import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Sparkles, User, StopCircle } from 'lucide-react';
import { Message } from './store/useBuilderStore';
import { motion, AnimatePresence } from 'framer-motion';

// Shared step interface from BuilderView
interface BuildStep {
    id: number;
    label: string;
    thoughts?: string[];
    status: 'pending' | 'active' | 'complete';
}

interface ChatPanelProps {
    messages: Message[];
    onSendMessage: (text: string) => void;
    onBack: () => void;
    isGenerating: boolean;
    agentStatus?: string;
    steps?: BuildStep[];
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, onBack, isGenerating, agentStatus, steps }) => {
    // DEBUG: Log props to verify data flow
    console.log('[ChatPanel] Render:', { isGenerating, agentStatus, stepsCount: steps?.length });

    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isGenerating]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [inputValue]);

    const handleSend = () => {
        if (!inputValue.trim() || isGenerating) return;
        onSendMessage(inputValue);
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full font-sans bg-[#0a0f14] relative text-white">
            {/* Header */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0a0f14]/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all active:scale-95"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="flex flex-col">
                        <span className="font-semibold text-white tracking-wide font-display">x-and builder</span>
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={isGenerating ? 'generating' : 'ready'}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-[10px] text-gray-500 flex items-center gap-1.5"
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${isGenerating ? 'bg-cyan-500 animate-pulse' : 'bg-green-500'}`}></span>
                                {isGenerating ? 'Orchestrating...' : 'Ready to build'}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar scroll-smooth">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`flex gap-4 ${msg.role === 'assistant' ? 'items-start' : 'items-start flex-row-reverse'}`}
                        >
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border shadow-sm ${msg.role === 'assistant'
                                ? 'bg-gradient-to-br from-cyan-950 to-cyan-900 border-cyan-500/20 text-cyan-400'
                                : 'bg-gradient-to-br from-gray-800 to-gray-900 border-white/10 text-gray-300'
                                }`}>
                                {msg.role === 'assistant' ? <Sparkles size={14} /> : <User size={14} />}
                            </div>

                            {/* Message Bubble */}
                            <div className={`max-w-[85%] flex flex-col gap-1 ${msg.role === 'assistant' ? 'items-start' : 'items-end'
                                }`}>
                                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'assistant'
                                    ? 'bg-transparent text-gray-300 border border-transparent'
                                    : 'bg-[#151e26] text-white border border-white/10'
                                    }`}>
                                    {msg.content}
                                </div>
                                <span className="text-[10px] text-gray-600 px-1 opacity-50">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Thinking Indicator */}
                {/* Thinking Indicator and Steps */}
                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col gap-3 py-2"
                    >
                        <div className="flex gap-4 items-center">
                            <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border bg-cyan-950/30 border-cyan-500/10 text-cyan-500/50">
                                <Sparkles size={14} />
                            </div>
                            <div className="flex items-center gap-1.5 h-8 px-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                                <div className="w-1.5 h-1.5 bg-cyan-500/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-cyan-500/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-cyan-500/40 rounded-full animate-bounce"></div>
                            </div>
                            {agentStatus && (
                                <span className="text-xs font-mono text-cyan-500/50 capitalize animate-pulse">
                                    {agentStatus}...
                                </span>
                            )}
                        </div>

                        {/* Live Steps Log */}
                        {steps && steps.length > 0 && (
                            <div className="ml-12 pl-4 border-l border-cyan-500/10 space-y-2">
                                {steps.map((step) => (
                                    <motion.div
                                        key={step.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex flex-col gap-1"
                                    >
                                        <div className={`text-xs font-mono flex items-center gap-2 ${step.status === 'active' ? 'text-cyan-400' :
                                            step.status === 'complete' ? 'text-gray-500' : 'text-gray-700'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${step.status === 'active' ? 'bg-cyan-500 animate-pulse' :
                                                step.status === 'complete' ? 'bg-gray-600' : 'bg-gray-800'
                                                }`} />
                                            <span className="truncate">{step.label}</span>
                                        </div>

                                        {/* Step Thoughts/Plan */}
                                        {step.thoughts && step.thoughts.length > 0 && (
                                            <div className="ml-3.5 pl-3 border-l border-white/5 space-y-1 my-1">
                                                {step.thoughts.map((thought, idx) => (
                                                    <div key={idx} className="text-[10px] text-gray-500 font-mono leading-tight">
                                                        • {thought}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#0a0f14] relative z-20">
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition duration-500"></div>
                    <div className="relative bg-[#0f151b] border border-white/10 rounded-2xl flex items-end p-2 transition-colors focus-within:border-white/20 shadow-lg">
                        <textarea
                            ref={textareaRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isGenerating}
                            placeholder={isGenerating ? "Wait for generation..." : "Describe your app..."}
                            className="flex-1 bg-transparent text-white text-sm outline-none resize-none p-3 max-h-32 placeholder-gray-600 disabled:opacity-50"
                            rows={1}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim() || isGenerating}
                            className={`p-2.5 rounded-xl mb-1 mr-1 transition-all duration-300 ${inputValue.trim() && !isGenerating
                                ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5'
                                : 'bg-white/5 text-gray-600 cursor-not-allowed'
                                }`}
                        >
                            {isGenerating ? <StopCircle size={16} /> : <Send size={16} strokeWidth={2.5} />}
                        </button>
                    </div>
                </div>
                <div className="text-center mt-3 text-[10px] text-gray-700 font-mono">
                    Command + Enter to send
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;