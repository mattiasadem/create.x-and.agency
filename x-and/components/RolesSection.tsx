import React, { useState } from 'react';
import { Search, Loader2, Check, Circle } from 'lucide-react';

const RolesSection: React.FC = () => {
  // State for Entrepreneurs Card interaction
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'updating' | 'updated'>('idle');

  // State for Students Card interaction
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Analyze current project', checked: true },
    { id: 2, text: 'Design todo app', checked: true },
    { id: 3, text: 'Implement state mgmt', checked: false },
  ]);

  const handleUpdate = () => {
    if (updateStatus !== 'idle') return;
    setUpdateStatus('updating');
    // Simulate network request
    setTimeout(() => {
        setUpdateStatus('updated');
        // Reset after a delay
        setTimeout(() => setUpdateStatus('idle'), 3000);
    }, 1500);
  };

  const toggleChecklist = (id: number) => {
    setChecklist(prev => prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-gray-400 font-medium mb-2">Whatever your role</h2>
          <h3 className="text-4xl md:text-5xl font-bold font-display tracking-wide text-white mb-6">x-and gives you superpowers</h3>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
             From idea to live product, x-and adapts to the way you work turning every vision into something real & fast
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
          {/* Product Managers */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors group">
             <div className="mb-4">
                <h4 className="text-white font-semibold font-display tracking-wide mb-1">Product managers</h4>
                <p className="text-xs text-gray-400">Go from insight to prototype in hours.</p>
             </div>
             <div className="bg-[#0a0f14] rounded-lg p-4 border border-white/5 h-[160px] relative overflow-hidden flex flex-col">
                <div className="text-xs text-gray-500 mb-2 font-mono">Version history</div>
                <div className="space-y-1 flex-1 overflow-y-auto custom-scrollbar">
                   {/* Interactive List Items */}
                   {['Landing page v2', 'User auth flow', 'Pricing modal'].map((item, i) => (
                       <div key={i} className="flex items-center gap-2 text-xs text-gray-300 p-1.5 rounded hover:bg-white/5 cursor-pointer transition-colors group/item">
                          <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-green-500' : 'bg-gray-600 group-hover/item:bg-gray-400'}`}></div>
                          <span>{item}</span>
                          {i === 0 && <span className="ml-auto text-[8px] bg-green-500/20 text-green-400 px-1 rounded">Live</span>}
                       </div>
                   ))}
                </div>
                <div className="mt-2 pt-2 border-t border-white/5">
                   <div className="flex items-center gap-2 bg-[#151e26] p-1.5 rounded border border-white/5 text-gray-500">
                      <Search size={10} />
                      <span className="text-[10px]">Search versions...</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Entrepreneurs */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors group">
             <div className="mb-4">
                <h4 className="text-white font-semibold font-display tracking-wide mb-1">Entrepreneurs</h4>
                <p className="text-xs text-gray-400">Launch a full business in days, not months.</p>
             </div>
             <div className="bg-[#0a0f14] rounded-lg p-4 border border-white/5 h-[160px] flex flex-col justify-between">
                <div>
                    <div className="text-xs text-gray-400 mb-1">Publish your project</div>
                    <div className="flex items-center gap-1 text-[10px] text-green-400 mb-2 font-mono bg-green-900/10 p-1 rounded w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                        https://dunder-mifflin.com
                    </div>
                </div>
                <button 
                    onClick={handleUpdate}
                    disabled={updateStatus !== 'idle'}
                    className={`w-full text-xs py-2 rounded border transition-all duration-300 flex items-center justify-center gap-2
                        ${updateStatus === 'updated' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                            : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20'
                        }
                    `}
                >
                    {updateStatus === 'idle' && 'Update Site'}
                    {updateStatus === 'updating' && <><Loader2 size={12} className="animate-spin"/> Publishing...</>}
                    {updateStatus === 'updated' && <><Check size={12}/> Published!</>}
                </button>
             </div>
          </div>

          {/* Marketers */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors group">
             <div className="mb-4">
                <h4 className="text-white font-semibold font-display tracking-wide mb-1">Marketers</h4>
                <p className="text-xs text-gray-400">High-performing pages with SEO built in.</p>
             </div>
             <div className="bg-[#0a0f14] rounded-lg p-4 border border-white/5 h-[160px] relative overflow-hidden group/chart">
                <div className="text-xs text-gray-500 mb-2 flex justify-between">
                    <span>Unique visitors</span>
                    <span className="text-cyan-400 font-mono">+24%</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-cyan-500/10 to-transparent">
                    {/* Interactive SVG Chart */}
                    <svg className="w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                        <path d="M0,50 L0,40 C10,35 20,45 30,30 C40,15 50,35 60,20 C70,10 80,15 100,5 L100,50 Z" fill="rgba(6,182,212,0.2)" className="group-hover/chart:opacity-80 transition-opacity duration-300" />
                        <path d="M0,40 C10,35 20,45 30,30 C40,15 50,35 60,20 C70,10 80,15 100,5" fill="none" stroke="#06b6d4" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]" />
                        
                        {/* Hover Tooltip Point */}
                        <circle cx="60" cy="20" r="0" fill="#fff" className="group-hover/chart:r-2 transition-all duration-300 ease-out" />
                    </svg>
                    
                    {/* Tooltip Label */}
                    <div className="absolute top-4 left-[55%] -translate-x-1/2 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-[9px] text-white opacity-0 group-hover/chart:opacity-100 transition-opacity duration-300 border border-white/10 pointer-events-none">
                        1,240
                    </div>
                </div>
             </div>
          </div>
        </div>
        
        {/* Bottom 2 wider cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                 <div className="relative z-10">
                    <h4 className="text-white font-semibold font-display tracking-wide mb-1">Agencies</h4>
                    <p className="text-xs text-gray-400 mb-4">Multiply your impact: deliver more projects.</p>
                 </div>
                 <div className="flex gap-4 opacity-50 group-hover:opacity-80 transition-opacity translate-y-4 group-hover:translate-y-0 duration-500">
                    <div className="w-32 h-24 bg-[#151e26] rounded-lg border border-white/10 shadow-lg transform group-hover:-rotate-3 transition-transform duration-500"></div>
                    <div className="w-32 h-24 bg-[#1f2933] rounded-lg border border-white/10 -mt-4 shadow-xl transform group-hover:rotate-2 transition-transform duration-500"></div>
                 </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                 <div className="relative z-10">
                    <h4 className="text-white font-semibold font-display tracking-wide mb-1">Students & builders</h4>
                    <p className="text-xs text-gray-400 mb-4">Learn by doing. Take ideas from class or side projects.</p>
                 </div>
                 <div className="bg-[#151e26] rounded-lg p-4 text-[10px] font-mono text-gray-400 border-l-2 border-green-500 opacity-90 hover:opacity-100 transition-opacity">
                    <div className="flex flex-col gap-2">
                        {checklist.map((item) => (
                            <div 
                                key={item.id} 
                                onClick={() => toggleChecklist(item.id)}
                                className={`flex items-center gap-2 cursor-pointer hover:text-gray-200 transition-colors ${item.checked ? 'opacity-50 line-through' : 'opacity-100'}`}
                            >
                                {item.checked 
                                    ? <Check size={12} className="text-green-500" /> 
                                    : <Circle size={12} className="text-gray-600" />
                                }
                                <span>{item.text}</span>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default RolesSection;