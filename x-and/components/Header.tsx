import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Github, Twitter, Youtube, Disc } from 'lucide-react';
import Button from './ui/Button';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Community', href: '#' },
    { name: 'Enterprise', href: '#' },
    { name: 'Resources', href: '#', hasDropdown: true },
    { name: 'Careers', href: '#' },
    { name: 'Pricing', href: '#' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-64 ${isScrolled ? 'bg-[#020405]/80 backdrop-blur-lg border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <span className="text-xl font-bold font-display tracking-wide text-white">x-and</span>

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
            <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black border-none">Get started</Button>
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
              <Button className="w-full justify-center">Get started</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;