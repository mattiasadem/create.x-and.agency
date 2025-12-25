'use client';

import React from 'react';
import CircuitBackground from '@/components/app/(home)/sections/hero/CircuitBackground';
import { FiX } from '@/lib/icons';
import LoadingCard from '../generation/LoadingCard';

export default function LoadingScreensGallery() {
    return (
        <div className="min-h-screen bg-[#020405] text-white p-8">
            <h1 className="text-3xl font-display font-bold mb-8 text-center">Loading Screens Gallery</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. Empty State - Ready to Create */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-mono text-cyan-500">1. Empty State</h2>
                    <div className="relative h-[600px] bg-[#020405] border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center">
                        <CircuitBackground />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.05)_0%,_rgba(0,0,0,0)_70%)]" />

                        <div className="relative z-10 w-full h-full flex items-center justify-center px-6">
                            <LoadingCard>
                                <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
                                    <h2 className="text-3xl font-display font-bold text-white mb-4 tracking-tight text-center">
                                        Ready to Create
                                    </h2>
                                    <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-4 mx-auto" />
                                    <p className="text-gray-400 font-light text-lg mb-4 max-w-sm mx-auto text-center">
                                        Describe your app in the chat to begin the generation process.
                                    </p>
                                </div>
                            </LoadingCard>
                        </div>
                    </div>
                </div>

                {/* 2. Initial Generation Overlay */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-mono text-cyan-500">2. Initial Generation (Analysis)</h2>
                    <div className="relative h-[600px] bg-[#020405] border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center">
                        <CircuitBackground />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.05)_0%,_rgba(0,0,0,0)_70%)]" />
                        <div className="absolute inset-0 flex items-center justify-center z-50">
                            <LoadingCard>
                                <div className="flex flex-col items-center justify-center relative z-10 w-full">
                                    {/* Futuristic Loader */}
                                    <div className="w-16 h-16 relative mb-8">
                                        <div className="absolute inset-0 border-2 border-gray-800 rounded-full" />
                                        <div className="absolute inset-0 border-2 border-cyan-500 rounded-full animate-spin border-t-transparent shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                    </div>

                                    {/* Status Text with Glitch Effect */}
                                    <div className="text-center space-y-4 relative z-10 w-full">
                                        <h3 className="text-2xl font-display font-bold text-white tracking-wide">
                                            ANALYZING TARGET
                                        </h3>

                                        <div className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent mx-auto" />

                                        <p className="font-mono text-cyan-400/70 text-xs tracking-wider uppercase">
                                            Extracting visual data points...
                                        </p>
                                    </div>
                                </div>
                            </LoadingCard>
                        </div>
                    </div>
                </div>

                {/* 3. Package Installation (Terminal) */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-mono text-cyan-500">3. Package Installation</h2>
                    <div className="relative h-[600px] bg-[#020405] border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.05)_0%,_rgba(0,0,0,0)_70%)]" />
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <LoadingCard>
                                <div className="flex items-start gap-6">
                                    {/* Animated Terminal Icon */}
                                    <div className="w-16 h-16 rounded-xl bg-black border border-white/10 flex items-center justify-center flex-shrink-0 relative">
                                        <div className="absolute inset-0 border-2 border-gray-800 rounded-xl" />
                                        <div className="absolute inset-0 border-2 border-cyan-500 rounded-xl animate-spin border-t-transparent shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-display font-medium text-white mb-1">
                                            Installing Dependencies
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-6">
                                            Fetching packages from registry...
                                        </p>

                                        {/* Terminal-style package list */}
                                        <div className="bg-black/80 rounded-lg p-4 font-mono text-xs border border-white/5 max-h-40 overflow-y-auto scrollbar-hide">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-green-500">✓</span>
                                                    <span className="text-gray-300">react</span>
                                                    <span className="text-gray-600 ml-auto">120ms</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-green-500">✓</span>
                                                    <span className="text-gray-300">react-dom</span>
                                                    <span className="text-gray-600 ml-auto">95ms</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-600">→</span>
                                                    <span className="text-gray-500">framer-motion</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-600">→</span>
                                                    <span className="text-gray-500">lucide-react</span>
                                                </div>
                                                <div className="animate-pulse text-cyan-500 mt-1">_</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </LoadingCard>
                        </div>
                    </div>
                </div>

                {/* 4. File Injection */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-mono text-cyan-500">4. File Injection</h2>
                    <div className="relative h-[600px] bg-[#020405] border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.05)_0%,_rgba(0,0,0,0)_70%)]" />
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <LoadingCard>
                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 rounded-xl bg-black border border-white/10 flex items-center justify-center flex-shrink-0">
                                        <div className="w-6 h-6 flex flex-col gap-1 justify-center items-center">
                                            <span className="w-4 h-0.5 bg-green-500 rounded-full animate-pulse" />
                                            <span className="w-4 h-0.5 bg-green-500 rounded-full animate-pulse delay-75" />
                                            <span className="w-4 h-0.5 bg-green-500 rounded-full animate-pulse delay-150" />
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-display font-medium text-white mb-1">
                                            Writing File System
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-6">
                                            Injecting generated code...
                                        </p>

                                        {/* File injection progress */}
                                        <div className="bg-black/80 rounded-lg p-4 font-mono text-xs border border-white/5">
                                            <div className="flex justify-between text-gray-400 mb-2">
                                                <span>Injecting files</span>
                                                <span>15 items</span>
                                            </div>
                                            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500 animate-progressBar" style={{ width: '100%' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </LoadingCard>
                        </div>
                    </div>
                </div>

                {/* 5. Sandbox Loading */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-mono text-cyan-500">5. Sandbox Loading</h2>
                    <div className="relative h-[600px] bg-[#020405] border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center">
                        <CircuitBackground />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.05)_0%,_rgba(0,0,0,0)_70%)]" />

                        <div className="relative z-10 w-full h-full flex items-center justify-center px-6">
                            <LoadingCard>
                                <div className="flex flex-col items-center">
                                    <div className="w-16 h-16 relative mb-6">
                                        <div className="absolute inset-0 border-2 border-gray-800 rounded-full" />
                                        <div className="absolute inset-0 border-2 border-cyan-500 rounded-full animate-spin border-t-transparent shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                    </div>
                                    <h3 className="text-lg font-display font-medium text-white mb-1">CONNECTING TO SANDBOX</h3>
                                    <p className="text-gray-500 text-sm font-mono">Establishing secure preview channel...</p>
                                </div>
                            </LoadingCard>
                        </div>
                    </div>
                </div>

                {/* 6. Error State */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-mono text-cyan-500">6. Error State</h2>
                    <div className="relative h-[600px] bg-[#020405] border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center">
                        <CircuitBackground />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.05)_0%,_rgba(0,0,0,0)_70%)]" />

                        <div className="relative z-10 max-w-md text-center px-6">
                            <div className="w-full max-w-lg px-8 py-20 border border-red-500/30 rounded-xl bg-red-950/20 shadow-2xl relative overflow-hidden backdrop-blur-md">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
                                <h3 className="text-xl font-display font-medium text-white mb-2 text-center">Detailed Analysis Failed</h3>
                                <p className="text-sm text-red-300/80 leading-relaxed mb-4 text-center">The target website structure was too complex to parse completely. Some visual elements may be missing or approximated.</p>
                                <div className="text-xs text-gray-500 font-mono text-center">Systems initialized in fallback mode</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 7. Initializing Stage */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-mono text-cyan-500">7. Initializing Stage</h2>
                    <div className="relative h-[600px] bg-[#020405] border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center">
                        <CircuitBackground />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.05)_0%,_rgba(0,0,0,0)_70%)]" />
                        <LoadingCard>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 relative mb-8">
                                    <div className="absolute inset-0 border-2 border-gray-800 rounded-full" />
                                    <div className="absolute inset-0 border-2 border-cyan-500 rounded-full animate-spin border-t-transparent shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                </div>
                                <h3 className="text-lg font-display font-medium text-white mb-1 uppercase tracking-wider">INITIALIZING</h3>
                                <p className="text-gray-500 text-sm font-mono text-center">Setting up secure sandbox environment...</p>
                            </div>
                        </LoadingCard>
                    </div>
                </div>

                {/* 8. Planning Stage */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-mono text-cyan-500">8. Planning Stage</h2>
                    <div className="relative h-[600px] bg-[#020405] border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center">
                        <CircuitBackground />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.05)_0%,_rgba(0,0,0,0)_70%)]" />
                        <LoadingCard>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 relative mb-8">
                                    <div className="absolute inset-0 border-2 border-gray-800 rounded-full" />
                                    <div className="absolute inset-0 border-2 border-cyan-500 rounded-full animate-spin border-t-transparent shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                </div>
                                <h3 className="text-lg font-display font-medium text-white mb-1 uppercase tracking-wider">PLANNING</h3>
                                <p className="text-gray-500 text-sm font-mono text-center">Creating sandbox while I plan your app...</p>
                            </div>
                        </LoadingCard>
                    </div>
                </div>

                {/* 9. Optimizing Stage */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-mono text-cyan-500">9. Optimizing Stage</h2>
                    <div className="relative h-[600px] bg-[#020405] border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center">
                        <CircuitBackground />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.05)_0%,_rgba(0,0,0,0)_70%)]" />
                        <LoadingCard>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 relative mb-8">
                                    <div className="absolute inset-0 border-2 border-gray-800 rounded-full" />
                                    <div className="absolute inset-0 border-2 border-cyan-500 rounded-full animate-spin border-t-transparent shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                </div>
                                <h3 className="text-lg font-display font-medium text-white mb-1 uppercase tracking-wider">OPTIMIZING</h3>
                                <p className="text-gray-500 text-sm font-mono text-center">Checking packages and configuration...</p>
                            </div>
                        </LoadingCard>
                    </div>
                </div>

                {/* 10. Analyzing Stage */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-mono text-cyan-500">10. Analyzing Stage</h2>
                    <div className="relative h-[600px] bg-[#020405] border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center">
                        <CircuitBackground />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.05)_0%,_rgba(0,0,0,0)_70%)]" />
                        <LoadingCard>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 relative mb-8">
                                    <div className="absolute inset-0 border-2 border-gray-800 rounded-full" />
                                    <div className="absolute inset-0 border-2 border-cyan-500 rounded-full animate-spin border-t-transparent shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                </div>
                                <h3 className="text-lg font-display font-medium text-white mb-1 uppercase tracking-wider">ANALYZING</h3>
                                <p className="text-gray-500 text-sm font-mono text-center">Extracting brand styles from website...</p>
                            </div>
                        </LoadingCard>
                    </div>
                </div>

                {/* 11. Generating Stage */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-mono text-cyan-500">11. Generating Stage</h2>
                    <div className="relative h-[600px] bg-[#020405] border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center">
                        <CircuitBackground />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.05)_0%,_rgba(0,0,0,0)_70%)]" />
                        <LoadingCard>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 relative mb-8">
                                    <div className="absolute inset-0 border-2 border-gray-800 rounded-full" />
                                    <div className="absolute inset-0 border-2 border-cyan-500 rounded-full animate-spin border-t-transparent shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                                </div>
                                <h3 className="text-lg font-display font-medium text-white mb-1 uppercase tracking-wider">GENERATING</h3>
                                <p className="text-gray-500 text-sm font-mono text-center">Building your custom component...</p>
                            </div>
                        </LoadingCard>
                    </div>
                </div>

            </div>
        </div>
    );
}
