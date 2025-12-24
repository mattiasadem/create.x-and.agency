import React, { useState, useEffect } from 'react';
import { Sparkles, Code2, Bot, Zap, Layers, Palette, ShieldCheck, Cpu } from 'lucide-react';

const FeaturesGrid: React.FC = () => {
    const [count, setCount] = useState(0);
    const [activeTab, setActiveTab] = useState(0);

    // Design System State
    const [activeTheme, setActiveTheme] = useState<'cyan' | 'purple' | 'amber'>('cyan');

    useEffect(() => {
        let start = 0;
        const end = 98;
        const duration = 2000;
        const incrementTime = duration / end;

        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, incrementTime);

        return () => clearInterval(timer);
    }, []);

    // Auto-cycle models for Card 1
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTab((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const themes = {
        cyan: { primary: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/50', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.3)]' },
        purple: { primary: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/50', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]' },
        amber: { primary: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/50', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]' },
    };

    const models = [
        { name: 'Claude 3.5 Sonnet', icon: Code2, role: 'Architect & Code', color: 'text-orange-400', bg: 'bg-orange-400/10' },
        { name: 'GPT-4o', icon: Sparkles, role: 'Reasoning & Copy', color: 'text-green-400', bg: 'bg-green-400/10' },
        { name: 'Gemini 1.5 Pro', icon: Zap, role: 'Context & Vision', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    ];

    return (
        <section className="py-32 relative overflow-hidden bg-[#020405]">
            {/* Background Ambience */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-900/10 blur-[120px] rounded-[100%] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-gray-400 mb-6 backdrop-blur-md">
                        <Cpu size={12} />
                        <span>Next-Gen Infrastructure</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold font-display tracking-tight mb-6 text-white leading-tight">
                        Empowering builders with<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 relative">
                            intelligent agents
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        x-and orchestrates the world's best AI models to handle the complexity, allowing you to focus purely on the vision.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Card 1: Multi-Model Orchestration (Span 7) */}
                    <div className="md:col-span-7 h-[400px] glass-card rounded-3xl p-8 relative overflow-hidden group border border-white/10 flex flex-col justify-between">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                    <Bot className="text-cyan-400 w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-semibold text-white tracking-wide">Model Orchestration</h3>
                            </div>
                            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                                Why choose one? x-and routes every task to the model best suited for it. Claude for code, GPT for reasoning, Gemini for context.
                            </p>
                        </div>

                        {/* Visual */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[350px] space-y-3 p-6 select-none pointer-events-none">
                            {models.map((m, i) => (
                                <div
                                    key={m.name}
                                    className={`relative p-4 rounded-xl border transition-all duration-500 ease-out transform
                                ${i === activeTab
                                            ? 'bg-[#151e26] border-cyan-500/30 shadow-lg translate-x-0 opacity-100 scale-100 z-10'
                                            : 'bg-[#0a0f14] border-white/5 translate-x-8 opacity-40 scale-95 z-0'
                                        }
                            `}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 rounded-md ${m.bg} ${m.color}`}>
                                                <m.icon size={16} />
                                            </div>
                                            <span className="text-sm font-medium text-white">{m.name}</span>
                                        </div>
                                        {i === activeTab && (
                                            <div className="flex items-center gap-1.5">
                                                <span className="relative flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                                                </span>
                                                <span className="text-[10px] text-cyan-400 font-mono">ACTIVE</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 font-mono pl-10">
                                        Assigned: <span className="text-gray-300">{m.role}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Card 2: Error Reduction (Span 5) */}
                    <div className="md:col-span-5 h-[400px] glass-card rounded-3xl p-8 relative overflow-hidden group border border-white/10 flex flex-col">
                        <div className="relative z-10 mb-auto">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                    <ShieldCheck className="text-green-400 w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-semibold text-white tracking-wide">Self-Healing Code</h3>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Automated testing and refactoring agents catch bugs before you even see them.
                            </p>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center relative">
                            <div className="text-8xl font-bold font-display text-white tracking-tighter mb-2 relative z-10">
                                {count}%
                            </div>
                            <div className="text-sm font-medium text-green-400 tracking-widest uppercase mb-8">Error Reduction</div>

                            {/* Abstract Scanner visual */}
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[120px] bg-gradient-to-b from-transparent via-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <div className="absolute inset-x-0 h-[1px] bg-green-500/50 blur-[2px] top-1/2 group-hover:animate-scan"></div>
                        </div>
                    </div>

                    {/* Card 3: Context Window (Span 5) */}
                    <div className="md:col-span-5 h-[400px] glass-card rounded-3xl p-8 relative overflow-hidden group border border-white/10">
                        <div className="relative z-20">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                    <Layers className="text-purple-400 w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-semibold text-white tracking-wide">Massive Context</h3>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                x-and holds your entire project in memory. It knows every file, every import, and every dependency.
                            </p>
                        </div>

                        {/* Infinite Stack Visual */}
                        <div className="absolute inset-0 top-24 overflow-hidden mask-gradient-b">
                            <div className="relative w-full h-full perspective-1000">
                                <div className="absolute left-1/2 -translate-x-1/2 w-[80%] flex flex-col gap-3 transform rotate-x-20">
                                    {[1, 2, 3, 4, 5, 6].map((_, i) => (
                                        <div key={i} className={`bg-[#0f151b] border border-white/5 p-3 rounded-lg flex items-center gap-3 transform transition-all duration-700 group-hover:translate-y-[-10px] group-hover:scale-105 opacity-${100 - i * 15}`}>
                                            <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
                                                <Code2 size={14} className="text-gray-600" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="h-1.5 w-12 bg-white/10 rounded"></div>
                                                <div className="h-1.5 w-24 bg-white/5 rounded"></div>
                                            </div>
                                            <div className="text-[10px] text-gray-600 font-mono">.tsx</div>
                                        </div>
                                    ))}
                                </div>
                                {/* Vignette */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020405] via-transparent to-transparent"></div>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Design System (Span 7) */}
                    <div className="md:col-span-7 h-[400px] glass-card rounded-3xl p-8 relative overflow-hidden group border border-white/10 flex flex-col">
                        <div className="relative z-20 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                                        <Palette className="text-amber-400 w-5 h-5" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-white tracking-wide">Design System Native</h3>
                                </div>
                                <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                                    Don't settle for generic UI. x-and generates component libraries that match your brand's specific DNA.
                                </p>
                            </div>

                            {/* Controls */}
                            <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5 backdrop-blur-sm">
                                {(Object.keys(themes) as Array<keyof typeof themes>).map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setActiveTheme(t)}
                                        className={`w-6 h-6 rounded-md transition-all duration-300 ${t === activeTheme ? themes[t].primary : 'bg-white/10 hover:bg-white/20'}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Interactive Preview */}
                        <div className="flex-1 relative mt-8 flex items-center justify-center">
                            {/* Background Glow */}
                            <div className={`absolute inset-0 opacity-20 blur-[60px] transition-colors duration-500 ${themes[activeTheme].primary}`}></div>

                            {/* The Card */}
                            <div className={`relative w-[320px] bg-[#0a0f14]/90 backdrop-blur-xl border ${themes[activeTheme].border} rounded-2xl p-6 transition-all duration-500 transform group-hover:scale-[1.02] ${themes[activeTheme].glow}`}>
                                {/* Card Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`w-12 h-12 rounded-full ${themes[activeTheme].primary} flex items-center justify-center text-black shadow-lg`}>
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <div className="h-2 w-24 bg-white/20 rounded mb-2"></div>
                                        <div className="h-2 w-16 bg-white/10 rounded"></div>
                                    </div>
                                </div>
                                {/* Card Body */}
                                <div className="space-y-3 mb-6">
                                    <div className="h-2 w-full bg-white/5 rounded"></div>
                                    <div className="h-2 w-[90%] bg-white/5 rounded"></div>
                                    <div className="h-2 w-[60%] bg-white/5 rounded"></div>
                                </div>
                                {/* Card Actions */}
                                <div className="flex gap-3">
                                    <div className={`h-9 px-4 rounded-lg ${themes[activeTheme].primary} flex items-center justify-center text-xs font-bold text-black transition-colors duration-500 w-full`}>
                                        Primary
                                    </div>
                                    <div className="h-9 px-4 rounded-lg border border-white/10 flex items-center justify-center text-xs font-medium text-white w-full">
                                        Secondary
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <style>{`
        .mask-gradient-b {
            mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
        }
        .perspective-1000 {
            perspective: 1000px;
        }
        .rotate-x-20 {
            transform: rotateX(20deg);
        }
      `}</style>
        </section>
    );
};

export default FeaturesGrid;
