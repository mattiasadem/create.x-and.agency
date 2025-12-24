import React from 'react';

const TrustBadges: React.FC = () => {
    const companies = [
        { name: 'accenture', opacity: 0.8 },
        { name: 'Google', opacity: 0.9 },
        { name: 'intel', opacity: 0.7 },
        { name: 'Meta', opacity: 0.9 },
        { name: 'salesforce', opacity: 0.8 },
        { name: 'shopify', opacity: 0.9 },
        { name: 'stripe', opacity: 1.0 },
    ];

    return (
        <section className="py-12 border-b border-white/5 bg-[#020405]">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-[10px] tracking-widest font-semibold text-gray-500 uppercase mb-8">
                    The #1 professional vibe coding tool trusted by
                </p>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                    {/* Using text for logos to avoid external image dependencies, styled to look logo-ish */}
                    {companies.map((c) => (
                        <span key={c.name} className={`text-xl md:text-2xl font-bold text-white tracking-tight ${c.name === 'intel' ? 'italic font-serif' : ''} ${c.name === 'Google' ? 'font-sans' : ''}`}>
                            {c.name}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustBadges;
