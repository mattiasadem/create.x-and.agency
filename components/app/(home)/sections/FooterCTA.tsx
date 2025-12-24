import React from 'react';
import { Paperclip } from 'lucide-react';

const FooterCTA: React.FC = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background glow bottom */}
            <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-900/20 blur-[100px] pointer-events-none rounded-[50%]"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

            <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold font-display tracking-wide text-white mb-2">Ready to build</h2>
                <h2 className="text-4xl md:text-5xl font-bold font-display tracking-wide text-white mb-8">something amazing?</h2>
                <p className="text-gray-400 mb-10 text-sm">Try it out and start building for free</p>

                {/* Input - reused style from hero but smaller/simpler */}
                <div className="relative group max-w-xl mx-auto text-left">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl opacity-20 group-hover:opacity-40 blur transition duration-200"></div>
                    <div className="relative bg-[#0a0f14] rounded-xl border border-white/10 p-1.5 shadow-2xl flex items-center gap-2">
                        <button className="p-2 text-gray-500 hover:text-white transition-colors">
                            <Paperclip className="w-4 h-4" />
                        </button>
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-white placeholder-gray-600 outline-none text-sm h-10"
                            placeholder="Let's build a landing..."
                        />
                        <div className="flex items-center gap-3 pr-1">
                            <div className="text-[10px] text-gray-500 font-medium flex items-center gap-1 hover:text-gray-300 cursor-pointer">
                                <span className="w-3 h-3 rounded-full border border-gray-600 flex items-center justify-center text-[8px]">$</span>
                                Plan
                            </div>
                            <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg">
                                Build now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FooterCTA;
