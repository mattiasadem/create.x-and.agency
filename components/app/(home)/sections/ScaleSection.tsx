import React from 'react';
import { Database, Lock, Globe, BarChart3, Search, Zap, Server, ShieldCheck } from 'lucide-react';

const ScaleSection: React.FC = () => {
    return (
        <section className="py-32 bg-[#020405] relative border-t border-white/5 overflow-hidden">
            {/* Refined Background Decor */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] left-[10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-cyan-400 mb-6 backdrop-blur-md">
                        <Server size={12} />
                        <span>Backend Infrastructure</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-white mb-6 leading-tight">
                        Everything you need to scale.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            Built in.
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        Stop stitching together disparate platforms. x-and Cloud provides enterprise-grade infrastructure that scales automatically with your growth.
                    </p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">

                    {/* Card 1: Database (Large Vertical - Span 4) */}
                    <div className="md:col-span-4 md:row-span-2 glass-card rounded-3xl p-8 relative overflow-hidden group border border-white/10 flex flex-col justify-between min-h-[440px] bg-[#0a0f14]">
                        <div className="relative z-10">
                            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                                <Database size={20} />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Serverless Postgres</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Dedicated Postgres databases that scale to zero when unused and instantly handle traffic spikes.
                            </p>
                        </div>

                        {/* Visual: Database Core */}
                        <div className="absolute inset-0 flex items-center justify-center translate-y-12 md:translate-y-20">
                            <div className="relative w-64 h-64 perspective-1000">
                                {/* Animated Data Rings */}
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className={`absolute inset-0 border border-cyan-500/20 rounded-full animate-[spin_${10 + i * 5}s_linear_infinite]`}
                                        style={{ transform: `rotateX(60deg) scale(${1 - i * 0.2}) translateZ(${i * 20}px)` }}
                                    >
                                        <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>
                                    </div>
                                ))}
                                {/* Central Core */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-32 bg-gradient-to-b from-cyan-900/50 to-blue-900/20 border border-cyan-500/30 rounded-xl backdrop-blur-md transform-style-3d flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(6,182,212,0.1)_50%,transparent_100%)] animate-scan-vertical h-[200%]"></div>
                                    <Database className="text-cyan-500/50 w-8 h-8" />
                                </div>
                            </div>
                        </div>
                        {/* Vignette for text readability */}
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0a0f14] to-transparent pointer-events-none"></div>
                    </div>

                    {/* Card 2: Auth (Horizontal - Span 4) */}
                    <div className="md:col-span-4 glass-card rounded-3xl p-6 relative overflow-hidden group border border-white/10 flex flex-col bg-[#0a0f14]">
                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Identity & Auth</h3>
                                <p className="text-xs text-gray-400">Social logins, MFA, and Magic Links.</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                                <ShieldCheck size={16} />
                            </div>
                        </div>

                        {/* Visual: Auth Cards Interaction */}
                        <div className="relative flex-1 flex items-center justify-center -mt-2">
                            {/* Background Card */}
                            <div className="absolute w-48 h-24 bg-[#151e26] rounded-xl border border-white/5 transform scale-90 translate-y-[-8px] opacity-40 transition-transform duration-500 group-hover:scale-95 group-hover:translate-y-[-12px]"></div>

                            {/* Foreground Card */}
                            <div className="relative w-56 h-28 bg-[#0f161e] rounded-xl border border-white/10 shadow-2xl flex flex-col p-3 transition-all duration-500 group-hover:border-purple-500/30 group-hover:translate-y-[-4px]">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white">JD</div>
                                    <div className="space-y-1">
                                        <div className="h-1.5 w-20 bg-white/20 rounded-full"></div>
                                        <div className="h-1.5 w-12 bg-white/10 rounded-full"></div>
                                    </div>
                                    <div className="ml-auto p-1.5 rounded-md bg-green-500/10 text-green-400">
                                        <Lock size={10} />
                                    </div>
                                </div>
                                <div className="mt-auto flex items-center gap-2">
                                    <div className="flex-1 h-6 bg-white/5 rounded-md flex items-center px-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse"></div>
                                        <div className="ml-2 h-1 w-12 bg-white/10 rounded-full"></div>
                                    </div>
                                    <div className="px-3 py-1 rounded-md bg-purple-500 text-[9px] font-bold text-black">
                                        Verify
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Global Edge (Horizontal - Span 4) */}
                    <div className="md:col-span-4 glass-card rounded-3xl p-6 relative overflow-hidden group border border-white/10 flex flex-col bg-gradient-to-br from-[#0a0f14] to-blue-950/20">
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Edge Network</h3>
                                <p className="text-xs text-gray-400">Deploy to 35+ regions instantly.</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                                <Globe size={16} />
                            </div>
                        </div>

                        {/* Visual: Network Map */}
                        <div className="flex-1 relative mt-2 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 flex items-center justify-center">
                                {/* Abstract Map Dots */}
                                <div className="w-full h-full grid grid-cols-6 grid-rows-3 gap-4 p-4">
                                    {Array.from({ length: 18 }).map((_, i) => (
                                        <div key={i} className="flex items-center justify-center">
                                            <div className={`w-1 h-1 rounded-full ${[2, 5, 8, 11, 14].includes(i) ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse' : 'bg-white/10'}`}></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Connecting lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 150" preserveAspectRatio="none">
                                    <path d="M50,75 Q150,25 250,75" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite]" />
                                    <path d="M50,75 Q150,125 250,75" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.3" strokeDasharray="4 4" className="animate-[dash_20s_linear_infinite_reverse]" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: Analytics (Span 4) */}
                    <div className="md:col-span-4 glass-card rounded-3xl p-6 relative overflow-hidden group border border-white/10 flex flex-col bg-[#0a0f14]">
                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Analytics</h3>
                                <p className="text-xs text-gray-400">Privacy-first traffic insights.</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                                <BarChart3 size={16} />
                            </div>
                        </div>

                        {/* Visual: Line Chart */}
                        <div className="flex-1 flex items-end relative px-2 pb-2">
                            <svg className="w-full h-24 overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0,50 L0,35 Q20,45 40,20 T80,15 T100,5 L100,50 Z"
                                    fill="url(#chartGradient)"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                />
                                <path
                                    d="M0,35 Q20,45 40,20 T80,15 T100,5"
                                    fill="none"
                                    stroke="#22c55e"
                                    strokeWidth="2"
                                    vectorEffect="non-scaling-stroke"
                                    className="path-animate"
                                />
                                {/* Interactive Point */}
                                <circle cx="80" cy="15" r="3" fill="#22c55e" className="group-hover:scale-150 transition-transform duration-300 origin-center" />
                            </svg>
                        </div>
                    </div>

                    {/* Card 5: SEO (Span 4) */}
                    <div className="md:col-span-4 glass-card rounded-3xl p-6 relative overflow-hidden group border border-white/10 flex flex-col bg-[#0a0f14]">
                        <div className="flex items-start justify-between mb-6 relative z-10">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Instant SEO</h3>
                                <p className="text-xs text-gray-400">Auto-generated meta tags & sitemaps.</p>
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                                <Search size={16} />
                            </div>
                        </div>

                        {/* Visual: Code/Tags */}
                        <div className="flex-1 flex flex-col justify-center gap-2 relative opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 bg-white/5 p-2 rounded border border-white/5">
                                <span className="text-amber-500">&lt;meta</span>
                                <span className="text-blue-300">name</span>=<span>"description"</span>
                                <span className="text-amber-500">/&gt;</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-gray-500 bg-white/5 p-2 rounded border border-white/5 ml-4">
                                <span className="text-amber-500">&lt;title&gt;</span>
                                <span className="text-white">x-and Cloud</span>
                                <span className="text-amber-500">&lt;/title&gt;</span>
                            </div>
                            {/* Score Badge */}
                            <div className="absolute right-0 bottom-0 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2 py-1 flex items-center gap-1">
                                <Zap size={10} className="text-amber-400" />
                                <span className="text-xs font-bold text-amber-400">100</span>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-400 text-sm">
                        Integrates with <span className="text-white font-medium">Next.js</span>, <span className="text-white font-medium">React</span>, <span className="text-white font-medium">Vue</span>, and more.
                    </p>
                </div>
            </div>

            <style>{`
          .perspective-1000 { perspective: 1000px; }
          .transform-style-3d { transform-style: preserve-3d; }
          @keyframes scan-vertical {
              0% { transform: translateY(-50%); }
              100% { transform: translateY(0%); }
          }
          .animate-scan-vertical {
              animation: scan-vertical 3s linear infinite;
          }
          @keyframes dash {
              to { stroke-dashoffset: -100; }
          }
      `}</style>
        </section>
    );
};

export default ScaleSection;
