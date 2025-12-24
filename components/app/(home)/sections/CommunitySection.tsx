import React from 'react';
import { LayoutDashboard, Smartphone, ShoppingCart, Briefcase, Zap, Globe } from 'lucide-react';

const CommunitySection: React.FC = () => {
    const templates = [
        { name: 'Landing page', icon: Globe, color: 'bg-cyan-600', img: 'from-cyan-900 to-cyan-600' },
        { name: 'Dashboard', icon: LayoutDashboard, color: 'bg-blue-600', img: 'from-blue-900 to-blue-600' },
        { name: 'Mobile', icon: Smartphone, color: 'bg-purple-600', img: 'from-purple-900 to-purple-600' },
        { name: 'Portfolio', icon: Briefcase, color: 'bg-teal-600', img: 'from-teal-900 to-teal-600' },
        { name: 'E-commerce', icon: ShoppingCart, color: 'bg-indigo-600', img: 'from-indigo-900 to-indigo-600' },
        { name: 'Productivity', icon: Zap, color: 'bg-pink-600', img: 'from-pink-900 to-pink-600' },
    ];

    return (
        <section className="py-24 bg-[#020405]">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold font-display tracking-wide text-white mb-6">You can build literally anything</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
                    {templates.map((t) => (
                        <div key={t.name} className="group cursor-pointer">
                            <div className="bg-[#0a0f14] rounded-xl border border-white/5 overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:border-cyan-500/30">
                                <div className="p-3 flex items-center gap-2 border-b border-white/5 bg-[#0e141a]">
                                    <div className={`w-5 h-5 rounded flex items-center justify-center ${t.color}`}>
                                        <t.icon size={12} className="text-white" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-300">{t.name}</span>
                                </div>
                                <div className={`h-32 bg-gradient-to-br ${t.img} opacity-20 group-hover:opacity-30 transition-opacity relative`}>
                                    {/* Abstract UI representation */}
                                    <div className="absolute inset-4 bg-black/40 rounded border border-white/5"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <button className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#020405] bg-transparent border border-white/20 text-white hover:bg-white/5 px-6 py-2 text-sm">
                        See all community projects
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CommunitySection;
