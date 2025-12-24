"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { appConfig } from '@/config/app.config';
import { toast } from "sonner";

// Import shared components
import { HeaderProvider } from "@/components/shared/header/HeaderContext";

// Import hero section components
import HomeHeroBadge from "@/components/app/(home)/sections/hero/Badge/Badge";
import HomeHeroTitle from "@/components/app/(home)/sections/hero/Title/Title";

import { Menu, X, ChevronDown, Github, Twitter, Disc, ArrowRight, Paperclip } from 'lucide-react';

interface SearchResult {
  url: string;
  title: string;
  description: string;
  screenshot: string | null;
  markdown: string;
}

export default function HomePage() {
  const [url, setUrl] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>("1");
  const [selectedModel, setSelectedModel] = useState<string>(appConfig.ai.defaultModel);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);
  const [showSearchTiles, setShowSearchTiles] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [showSelectMessage, setShowSelectMessage] = useState<boolean>(false);
  const [showInstructionsForIndex, setShowInstructionsForIndex] = useState<number | null>(null);
  const [additionalInstructions, setAdditionalInstructions] = useState<string>('');
  const [extendBrandStyles, setExtendBrandStyles] = useState<boolean>(false);
  const router = useRouter();

  // Header Scroll State
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero Animation State
  const [heroIndex, setHeroIndex] = useState(0);
  const heroWords = ["Websites", "Apps", "AI Agents", "Automations", "Brands", "Products"];

  useEffect(() => {
    // Scroll listener for Header
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Hero Word Interval
    const interval = setInterval(() => {
      setHeroIndex((prevIndex) => (prevIndex + 1) % heroWords.length);
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, [heroWords.length]);

  const navLinks = [
    { name: 'Community', href: '#' },
    { name: 'Enterprise', href: '#' },
    { name: 'Resources', href: '#', hasDropdown: true },
    { name: 'Careers', href: '#' },
    { name: 'Pricing', href: '#' },
  ];

  // Simple URL validation
  const validateUrl = (urlString: string) => {
    if (!urlString) return false;
    // Basic URL pattern - accepts domains with or without protocol
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(urlString.toLowerCase());
  };

  // Check if input is a URL (contains a dot)
  const isURL = (str: string): boolean => {
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    return urlPattern.test(str.trim());
  };

  const styles = [
    { id: "1", name: "Glassmorphism", description: "Frosted glass effect" },
    { id: "2", name: "Neumorphism", description: "Soft 3D shadows" },
    { id: "3", name: "Brutalism", description: "Bold and raw" },
    { id: "4", name: "Minimalist", description: "Clean and simple" },
    { id: "5", name: "Dark Mode", description: "Dark theme design" },
    { id: "6", name: "Gradient Rich", description: "Vibrant gradients" },
    { id: "7", name: "3D Depth", description: "Dimensional layers" },
    { id: "8", name: "Retro Wave", description: "80s inspired" },
  ];

  const models = appConfig.ai.availableModels.map(model => ({
    id: model,
    name: appConfig.ai.modelDisplayNames[model] || model,
  }));

  const handleSubmit = async (selectedResult?: SearchResult) => {
    const inputValue = url.trim();

    if (!inputValue) {
      toast.error("Please enter a URL or search term");
      return;
    }

    // Validate brand extension mode requirements
    if (extendBrandStyles && isURL(inputValue) && !additionalInstructions.trim()) {
      toast.error("Please describe what you want to build with this brand's styles");
      return;
    }

    // If it's a search result being selected, fade out and redirect
    if (selectedResult) {
      setIsFadingOut(true);

      // Wait for fade animation
      setTimeout(() => {
        sessionStorage.setItem('targetUrl', selectedResult.url);
        sessionStorage.setItem('selectedStyle', selectedStyle);
        sessionStorage.setItem('selectedModel', selectedModel);
        sessionStorage.setItem('autoStart', 'true');
        if (selectedResult.markdown) {
          sessionStorage.setItem('siteMarkdown', selectedResult.markdown);
        }
        router.push('/generation');
      }, 500);
      return;
    }

    // If it's a URL, check if we're extending brand styles or cloning
    if (isURL(inputValue)) {
      if (extendBrandStyles) {
        // Brand extension mode - extract brand styles and use them with the prompt
        sessionStorage.setItem('targetUrl', inputValue);
        sessionStorage.setItem('selectedModel', selectedModel);
        sessionStorage.setItem('autoStart', 'true');
        sessionStorage.setItem('brandExtensionMode', 'true');
        sessionStorage.setItem('brandExtensionPrompt', additionalInstructions || '');
        router.push('/generation');
      } else {
        // Normal clone mode
        sessionStorage.setItem('targetUrl', inputValue);
        sessionStorage.setItem('selectedStyle', selectedStyle);
        sessionStorage.setItem('selectedModel', selectedModel);
        sessionStorage.setItem('autoStart', 'true');
        router.push('/generation');
      }
    } else {
      // It's a search term, fade out if results exist, then search
      if (hasSearched && searchResults.length > 0) {
        setIsFadingOut(true);

        setTimeout(async () => {
          setSearchResults([]);
          setIsFadingOut(false);
          setShowSelectMessage(true);

          // Perform new search
          await performSearch(inputValue);
          setHasSearched(true);
          setShowSearchTiles(true);
          setShowSelectMessage(false);

          // Smooth scroll to carousel
          setTimeout(() => {
            const carouselSection = document.querySelector('.carousel-section');
            if (carouselSection) {
              carouselSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
        }, 500);
      } else {
        // First search, no fade needed
        setShowSelectMessage(true);
        setIsSearching(true);
        setHasSearched(true);
        setShowSearchTiles(true);

        // Scroll to carousel area immediately
        setTimeout(() => {
          const carouselSection = document.querySelector('.carousel-section');
          if (carouselSection) {
            carouselSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);

        await performSearch(inputValue);
        setShowSelectMessage(false);
        setIsSearching(false);

        // Smooth scroll to carousel
        setTimeout(() => {
          const carouselSection = document.querySelector('.carousel-section');
          if (carouselSection) {
            carouselSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    }
  };

  // Perform search when user types
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim() || isURL(searchQuery)) {
      setSearchResults([]);
      setShowSearchTiles(false);
      return;
    }

    setIsSearching(true);
    setShowSearchTiles(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
        setShowSearchTiles(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <HeaderProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-cyan-500/20 selection:text-cyan-200 relative overflow-x-hidden">

        {/* Ported Header */}
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-64 header ${isScrolled ? 'bg-[#020405]/80 backdrop-blur-lg border-b border-white/5' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex items-center justify-between h-full">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                <span className="text-xl font-display font-normal tracking-wide text-white">x-and</span>
              </div>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium text-gray-400 hover:text-cyan-200 transition-colors flex items-center gap-1"
                  >
                    {link.name}
                    {link.hasDropdown && <ChevronDown className="w-3 h-3" />}
                  </a>
                ))}
              </nav>

              {/* Right Actions */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-3 pr-4 border-r border-white/10">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors"><Disc className="w-4 h-4" /></a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
                </div>
                <a href="#" className="text-sm font-medium text-white hover:text-gray-300">Sign in</a>
                <button className="inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#020405] bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.5)] border border-transparent px-4 py-2 text-sm">
                  Get started
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-400 hover:text-white p-2"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#020405] border-b border-white/10">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3 px-3">
                  <a href="#" className="text-center py-2 text-gray-300 font-medium">Sign in</a>
                  <button className="w-full justify-center inline-flex items-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#020405] bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.5)] border border-transparent px-4 py-2 text-sm">
                    Get started
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-64" id="home-hero">
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

          {/* Circuit Background */}
          <div className="absolute inset-0 w-full h-full z-0">
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
          </div>

          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 relative z-20 text-center">

            {/* Badge */}
            <div className="flex justify-center mb-6">
              <span className="px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-xs font-medium text-cyan-200 flex items-center gap-2 backdrop-blur-sm">
                Introducing x-and V1
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-normal tracking-wide mb-8 text-white flex flex-col items-center justify-center gap-2">
              <span>You can create</span>
              <span key={heroIndex} className="animate-word bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-display font-normal whitespace-nowrap pb-2">
                {heroWords[heroIndex]}
              </span>
            </h1>

            {/* Chat Input Box */}
            <div className="relative group max-w-2xl mx-auto">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl opacity-30 group-hover:opacity-50 blur transition duration-200"></div>
              <div className="relative bg-[#0a0f14]/90 backdrop-blur-xl rounded-2xl border border-cyan-500/20 p-2 shadow-2xl">

                {/* Search Mode UI */}
                {hasSearched && searchResults.length > 0 && !isFadingOut ? (
                  <div className="p-4 flex gap-4 items-center">
                    <div className="text-cyan-400">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                        <rect x="2" y="4" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                        <rect x="11" y="4" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                        <rect x="2" y="11" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                        <rect x="11" y="11" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    </div>
                    <div className="flex-1 text-lg font-light text-white text-left">
                      Select which site to clone from the results below
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setIsFadingOut(true);
                        setTimeout(() => {
                          setSearchResults([]);
                          setHasSearched(false);
                          setShowSearchTiles(false);
                          setIsFadingOut(false);
                          setUrl('');
                        }, 500);
                      }}
                      className="px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white transition-all border border-cyan-500/30 rounded-lg"
                    >
                      <span>Search Again</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <textarea
                      value={url}
                      onChange={(e) => {
                        const value = e.target.value;
                        setUrl(value);
                        setIsValidUrl(validateUrl(value));
                        if (value.trim() === "") {
                          setShowSearchTiles(false);
                          setHasSearched(false);
                          setSearchResults([]);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isSearching) {
                          e.preventDefault();
                          handleSubmit();
                        }
                      }}
                      className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none p-3 h-24 text-lg font-light"
                      placeholder="Let's build a customer portal where users can..."
                    />
                    <div className="flex items-center justify-between px-2 pb-1">
                      <button className="p-2 text-gray-500 hover:text-cyan-400 transition-colors rounded-lg hover:bg-white/5">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <div className="flex items-center gap-3">
                        {/* Plan / Brand Styles Toggle */}
                        <div
                          onClick={() => setExtendBrandStyles(!extendBrandStyles)}
                          className={`text-xs ${extendBrandStyles ? 'text-cyan-400' : 'text-gray-500'} font-medium flex items-center gap-1 hover:text-cyan-300 cursor-pointer transition-colors`}
                        >
                          <span className={`w-3 h-3 rounded-full border ${extendBrandStyles ? 'border-cyan-400' : 'border-gray-600'} flex items-center justify-center text-[8px]`}>$</span>
                          Plan
                        </div>

                        {/* Create Button */}
                        <button
                          onClick={() => !isSearching && handleSubmit()}
                          disabled={isSearching}
                          className={`flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-1.5 rounded-lg text-sm font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] ${isSearching ? 'opacity-50 cursor-wait' : ''}`}
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500 relative z-20">
              <span>or import from</span>
              <a href="#" className="flex items-center gap-1.5 hover:text-white transition-colors" onClick={(e) => e.preventDefault()}>
                <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49933 0.100098C3.49618 0.100098 0.249329 3.34695 0.249329 7.35009C0.249329 11.3532 3.49618 14.6001 7.49933 14.6001C11.5025 14.6001 14.7493 11.3532 14.7493 7.35009C14.7493 3.34695 11.5025 0.100098 7.49933 0.100098ZM3.54933 7.35009C3.54933 5.1687 5.31793 3.40009 7.49933 3.40009V7.35009H3.54933ZM7.49933 11.3001V7.35009H11.4493C11.4493 9.5315 9.68073 11.3001 7.49933 11.3001Z" fill="currentColor" /></svg>
                Figma
              </a>
              <a href="https://github.com/mendableai/open-lovable" target="_blank" className="flex items-center gap-1.5 hover:text-white transition-colors">
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent z-10"></div>
        </section>

        {/* Full-width oval carousel section */}
        {showSearchTiles && hasSearched && (
          <section className={`carousel-section relative w-full overflow-hidden mt-32 mb-32 transition-opacity duration-500 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
            <div className="absolute inset-0 bg-gradient-to-b from-[#020405]/50 to-[#020405] rounded-[50%] transform scale-x-150 -translate-y-24" />

            {isSearching ? (
              // Loading state with animated scrolling skeletons
              <div className="relative h-[250px] overflow-hidden">
                {/* Edge fade overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-[120px] z-20 pointer-events-none" style={{ background: 'linear-gradient(to right, #020405 0%, #020405 20%, transparent 100%)' }} />
                <div className="absolute right-0 top-0 bottom-0 w-[120px] z-20 pointer-events-none" style={{ background: 'linear-gradient(to left, #020405 0%, #020405 20%, transparent 100%)' }} />

                <div className="carousel-container absolute left-0 flex gap-12 py-4">
                  {/* Duplicate skeleton tiles for continuous scroll */}
                  {[...Array(10), ...Array(10)].map((_, index) => (
                    <div
                      key={`loading-${index}`}
                      className="flex-shrink-0 w-[400px] h-[240px] rounded-lg overflow-hidden border-2 border-gray-200/30 bg-white relative"
                    >
                      <div className="absolute inset-0 skeleton-shimmer">
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 skeleton-gradient" />
                      </div>

                      {/* Fake browser UI - 5x bigger */}
                      <div className="absolute top-0 left-0 right-0 h-40 bg-gray-100 border-b border-gray-200/50 flex items-center px-6 gap-4">
                        <div className="flex gap-3">
                          <div className="w-5 h-5 rounded-full bg-gray-300 animate-pulse" />
                          <div className="w-5 h-5 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: '0.1s' }} />
                          <div className="w-5 h-5 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: '0.2s' }} />
                        </div>
                        <div className="flex-1 h-8 bg-gray-200 rounded-md mx-6 animate-pulse" />
                      </div>

                      {/* Content skeleton - positioned just below nav bar */}
                      <div className="absolute top-44 left-4 right-4">
                        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
                        <div className="h-3 bg-gray-150 rounded w-1/2 mb-2 animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="h-3 bg-gray-150 rounded w-2/3 animate-pulse" style={{ animationDelay: '0.3s' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              // Actual results
              <div className="relative h-[250px] overflow-hidden">
                {/* Edge fade overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-[120px] z-20 pointer-events-none" style={{ background: 'linear-gradient(to right, #020405 0%, #020405 20%, transparent 100%)' }} />
                <div className="absolute right-0 top-0 bottom-0 w-[120px] z-20 pointer-events-none" style={{ background: 'linear-gradient(to left, #020405 0%, #020405 20%, transparent 100%)' }} />

                <div className="carousel-container absolute left-0 flex gap-12 py-4">
                  {/* Duplicate results for infinite scroll */}
                  {[...searchResults, ...searchResults].map((result, index) => (
                    <div
                      key={`${result.url}-${index}`}
                      className="group flex-shrink-0 w-[400px] h-[240px] rounded-lg overflow-hidden border-2 border-gray-200/50 transition-all duration-300 hover:shadow-2xl bg-white relative"
                      onMouseLeave={() => {
                        if (showInstructionsForIndex === index) {
                          setShowInstructionsForIndex(null);
                          setAdditionalInstructions('');
                        }
                      }}
                    >
                      {/* Hover overlay with clone buttons or instructions input */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col items-center justify-center p-6">
                        {showInstructionsForIndex === index ? (
                          /* Instructions input view - matching main input style exactly */
                          <div className="w-full max-w-[380px]">
                            <div className="bg-white rounded-20" style={{
                              boxShadow: "0px 0px 44px 0px rgba(0, 0, 0, 0.02), 0px 88px 56px -20px rgba(0, 0, 0, 0.03), 0px 56px 56px -20px rgba(0, 0, 0, 0.02), 0px 32px 32px -20px rgba(0, 0, 0, 0.03), 0px 16px 24px -12px rgba(0, 0, 0, 0.03), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)"
                            }}>
                              {/* Input area matching main search */}
                              <div className="p-16 flex gap-12 items-start w-full relative">
                                {/* Instructions icon */}
                                <div className="mt-2 flex-shrink-0">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="opacity-40"
                                  >
                                    <path d="M5 5H15M5 10H15M5 15H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                  </svg>
                                </div>

                                <textarea
                                  value={additionalInstructions}
                                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                                  placeholder="Describe your customizations..."
                                  className="flex-1 bg-transparent text-body-input text-accent-black placeholder:text-black-alpha-48 focus:outline-none focus:ring-0 focus:border-transparent resize-none min-h-[60px]"
                                  autoFocus
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                      e.stopPropagation();
                                      setShowInstructionsForIndex(null);
                                      setAdditionalInstructions('');
                                    }
                                  }}
                                />
                              </div>

                              {/* Divider */}
                              <div className="border-t border-black-alpha-5" />

                              {/* Buttons area matching main style */}
                              <div className="p-10 flex justify-between items-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowInstructionsForIndex(null);
                                    setAdditionalInstructions('');
                                  }}
                                  className="button relative rounded-10 px-8 py-8 text-label-medium font-medium flex items-center justify-center bg-black-alpha-4 hover:bg-black-alpha-6 text-black-alpha-48 active:scale-[0.995] transition-all"
                                >
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M12 5L7 10L12 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (additionalInstructions.trim()) {
                                      sessionStorage.setItem('additionalInstructions', additionalInstructions);
                                      handleSubmit(result);
                                    }
                                  }}
                                  disabled={!additionalInstructions.trim()}
                                  className={`
                                    button relative rounded-10 px-8 py-8 text-label-medium font-medium
                                    flex items-center justify-center gap-6
                                    ${additionalInstructions.trim()
                                      ? 'button-primary text-accent-white active:scale-[0.995]'
                                      : 'bg-black-alpha-4 text-black-alpha-24 cursor-not-allowed'
                                    }
                                  `}
                                >
                                  {additionalInstructions.trim() && <div className="button-background absolute inset-0 rounded-10 pointer-events-none" />}
                                  <span className="px-6 relative">Apply & Clone</span>
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="relative"
                                  >
                                    <path d="M11.6667 4.79163L16.875 9.99994M16.875 9.99994L11.6667 15.2083M16.875 9.99994H3.125" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Default buttons view */
                          <>
                            <div className="text-white text-center mb-3">
                              <p className="text-base font-semibold mb-0.5">{result.title}</p>
                              <p className="text-[11px] opacity-80">Choose how to clone this site</p>
                            </div>

                            <div className="flex gap-3 justify-center">
                              {/* Instant Clone Button - Orange/Heat style */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSubmit(result);
                                }}
                                className="bg-orange-500 hover:bg-orange-600 flex items-center justify-center button relative text-label-medium button-primary group/button rounded-10 p-8 gap-2 text-white active:scale-[0.995]"
                              >
                                <div className="button-background absolute inset-0 rounded-10 pointer-events-none" />
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="relative"
                                >
                                  <path d="M11.6667 4.79163L16.875 9.99994M16.875 9.99994L11.6667 15.2083M16.875 9.99994H3.125" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                                </svg>
                                <span className="px-6 relative">Instant Clone</span>
                              </button>

                              {/* Instructions Button - Gray style */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowInstructionsForIndex(index);
                                  setAdditionalInstructions('');
                                }}
                                className="bg-gray-100 hover:bg-gray-200 flex items-center justify-center button relative text-label-medium rounded-10 p-8 gap-2 text-gray-700 active:scale-[0.995]"
                              >
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="opacity-60"
                                >
                                  <path d="M5 5H15M5 10H15M5 15H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                  <path d="M14 14L16 16L14 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="px-6">Add Instructions</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      {result.screenshot ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={result.screenshot}
                            alt={result.title}
                            fill
                            className="object-cover object-top"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center">
                              <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-gray-400"
                              >
                                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M3 9H21" stroke="currentColor" strokeWidth="1.5" />
                                <circle cx="6" cy="6" r="1" fill="currentColor" />
                                <circle cx="9" cy="6" r="1" fill="currentColor" />
                                <circle cx="12" cy="6" r="1" fill="currentColor" />
                              </svg>
                            </div>
                            <p className="text-gray-500 text-sm font-medium">{result.title}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // No results state
              <div className="relative h-[250px] flex items-center justify-center">
                <div className="text-center">
                  <div className="mb-4">
                    <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">No results found</p>
                  <p className="text-gray-400 text-sm mt-1">Try a different search term</p>
                </div>
              </div>
            )}
          </section>
        )
        }


      </div >

      <style jsx>{`
        @keyframes infiniteScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .carousel-container {
          animation: infiniteScroll 30s linear infinite;
        }

        .carousel-container:hover {
          animation-play-state: paused;
        }

        .skeleton-shimmer {
          position: relative;
          overflow: hidden;
        }

        .skeleton-gradient {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </HeaderProvider >
  );
}