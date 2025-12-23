import React, { useState, useEffect } from 'react';
import { ArrowRight, Paperclip, Terminal, Github } from 'lucide-react';

const CircuitBackground = () => {
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(2,4,5,1)_0%,_rgba(2,4,5,0.4)_50%,_transparent_100%)] z-10 pointer-events-none"></div>
    </div>
  );
};

interface HeroProps {
  onStartBuild?: (prompt: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onStartBuild }) => {
  const [index, setIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const words = ["Websites", "Apps", "AI Agents", "Automations", "Brands", "Products"];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [words.length]);

  const handleSubmit = () => {
    if (onStartBuild) {
      onStartBuild(inputValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
      <style>{`
        @keyframes cool-slide-up {
            0% {
                opacity: 0;
                transform: translateY(20px) scale(0.9);
                filter: blur(4px);
            }
            100% {
                opacity: 1;
                transform: translateY(0) scale(1);
                filter: blur(0);
            }
        }
        .animate-word {
            animation: cool-slide-up 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}</style>

      {/* Background with Animation */}
      <div className="absolute inset-0 w-full h-full z-0">
        <CircuitBackground />
      </div>

      {/* Content */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 relative z-20 text-center">

        <div className="flex justify-center mb-6">
          <span className="px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-xs font-medium text-cyan-200 flex items-center gap-2 backdrop-blur-sm">
            Introducing x-and V1
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display tracking-wide mb-8 text-white flex flex-col items-center justify-center gap-2">
          <span>You can create</span>
          <span key={index} className="animate-word text-gradient font-display whitespace-nowrap pb-2">
            {words[index]}
          </span>
        </h1>

        {/* Chat Input Box */}
        <div className="relative group max-w-2xl mx-auto">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-30 group-hover:opacity-50 blur transition duration-200"></div>
          <div className="relative bg-[#0a0f14]/90 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-2 shadow-2xl">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none p-3 h-24 text-lg font-light"
              placeholder="Let's build a customer portal where users can..."
            />
            <div className="flex items-center justify-between px-2 pb-1">
              <button className="p-2 text-gray-500 hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5">
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-500 font-medium flex items-center gap-1 hover:text-gray-300 cursor-pointer transition-colors">
                  <span className="w-3 h-3 rounded-full border border-gray-600 flex items-center justify-center text-[8px]">$</span>
                  Plan
                </div>
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
          <span>or import from</span>
          <a href="#" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49933 0.100098C3.49618 0.100098 0.249329 3.34695 0.249329 7.35009C0.249329 11.3532 3.49618 14.6001 7.49933 14.6001C11.5025 14.6001 14.7493 11.3532 14.7493 7.35009C14.7493 3.34695 11.5025 0.100098 7.49933 0.100098ZM3.54933 7.35009C3.54933 5.1687 5.31793 3.40009 7.49933 3.40009V7.35009H3.54933ZM7.49933 11.3001V7.35009H11.4493C11.4493 9.5315 9.68073 11.3001 7.49933 11.3001Z" fill="currentColor" /></svg>
            Figma
          </a>
          <a href="#" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        </div>
      </div>

      {/* Decorative Arc - Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent z-10"></div>
    </section>
  );
};

export default Hero;