import React from 'react';

interface CircuitBackgroundProps {
    showVignette?: boolean;
}

const CircuitBackground = ({ showVignette = true }: CircuitBackgroundProps) => {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#020405]">
            {/* 1. Subtle Grid Background */}
            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage: `linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)`,
                    backgroundSize: '30px 30px'
                }}
            ></div>

            {/* 2. Main SVG Circuit Animation */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="trace-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#06b6d4" /> {/* Cyan 500 */}
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>

                    <linearGradient id="trace-grad-rev" x1="100%" y1="0%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#22d3ee" /> {/* Cyan 400 */}
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>

                    <filter id="glow">
                        <feGaussianBlur stdDeviation="0.4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <style>
                    {`
                @keyframes flow {
                    0% { stroke-dashoffset: 100; }
                    100% { stroke-dashoffset: -100; }
                }
                .circuit-static {
                    fill: none;
                    stroke: #1e293b;
                    stroke-width: 0.1;
                    opacity: 0.5;
                }
                .circuit-active {
                    fill: none;
                    stroke: url(#trace-grad);
                    stroke-width: 0.2;
                    stroke-dasharray: 20 80;
                    stroke-dashoffset: 100;
                    animation: flow 5s linear infinite;
                    filter: url(#glow);
                    opacity: 0.8;
                }
                 .circuit-active-rev {
                    fill: none;
                    stroke: url(#trace-grad-rev);
                    stroke-width: 0.2;
                    stroke-dasharray: 20 80;
                    stroke-dashoffset: 100;
                    animation: flow 6s linear infinite reverse;
                    filter: url(#glow);
                    opacity: 0.8;
                }
            `}
                </style>

                {/* Left Side Complex Traces */}
                <g>
                    <path d="M-10,20 L15,20 L25,30 L25,110" className="circuit-static" />
                    <path d="M-10,20 L15,20 L25,30 L25,110" className="circuit-active" style={{ animationDuration: '7s' }} />

                    <path d="M-10,35 L10,35 L15,40 L15,110" className="circuit-static" />
                    <path d="M-10,35 L10,35 L15,40 L15,110" className="circuit-active" style={{ animationDuration: '5s', animationDelay: '1s' }} />

                    <path d="M-10,60 L5,60 L10,65 L10,110" className="circuit-static" />
                    <path d="M-10,60 L5,60 L10,65 L10,110" className="circuit-active" style={{ animationDuration: '8s', animationDelay: '2s' }} />
                </g>

                {/* Right Side Complex Traces (Mirrored) */}
                <g>
                    <path d="M110,20 L85,20 L75,30 L75,110" className="circuit-static" />
                    <path d="M110,20 L85,20 L75,30 L75,110" className="circuit-active-rev" style={{ animationDuration: '6.5s' }} />

                    <path d="M110,40 L90,40 L85,45 L85,110" className="circuit-static" />
                    <path d="M110,40 L90,40 L85,45 L85,110" className="circuit-active-rev" style={{ animationDuration: '4.5s', animationDelay: '0.5s' }} />

                    <path d="M110,70 L95,70 L90,75 L90,110" className="circuit-static" />
                    <path d="M110,70 L95,70 L90,75 L90,110" className="circuit-active-rev" style={{ animationDuration: '9s', animationDelay: '1.5s' }} />
                </g>

                {/* Top Connecting Lines */}
                <path d="M30,0 L30,5 L35,10 L65,10 L70,5 L70,0" className="circuit-static" />
                <path d="M30,0 L30,5 L35,10 L65,10 L70,5 L70,0" className="circuit-active" style={{ animationDuration: '10s' }} />
            </svg>

            {/* 3. Radial Fade Overlay (Vignette) for center readability */}
            {showVignette && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(2,4,5,1)_0%,_rgba(2,4,5,0.4)_50%,_transparent_100%)] z-10 pointer-events-none"></div>
            )}
        </div>
    );
};

export default CircuitBackground;
