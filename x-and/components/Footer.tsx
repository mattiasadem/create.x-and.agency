import React from 'react';
import { Github, Twitter, Youtube, Disc, Linkedin, MessageSquare } from 'lucide-react';

const Footer: React.FC = () => {
  const links = {
    resources: ['Support', 'Blog', 'Gallery', 'Status'],
    company: ['Careers', 'Privacy', 'Terms'],
    social: [
      { name: 'Discord', icon: MessageSquare },
      { name: 'LinkedIn', icon: Linkedin },
      { name: 'YouTube', icon: Youtube },
      { name: 'Twitter/X', icon: Twitter },
      { name: 'Instagram', icon: Disc }, // Placeholder icon for IG
      { name: 'Reddit', icon: Disc }, // Placeholder icon for Reddit
    ]
  };

  return (
    <footer className="bg-background py-12 border-t border-white/5 text-sm">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-xl mb-6">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400">
               <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            x-and
          </div>
        </div>

        {/* Resources */}
        <div>
           <h4 className="font-semibold text-gray-200 mb-4">Resources</h4>
           <ul className="space-y-3">
             {links.resources.map(link => (
                <li key={link}>
                  <a href="#" className="text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                    {link} <span className="text-[10px] opacity-50">↗</span>
                  </a>
                </li>
             ))}
           </ul>
        </div>

        {/* Company */}
        <div>
           <h4 className="font-semibold text-gray-200 mb-4">Company</h4>
           <ul className="space-y-3">
             {links.company.map(link => (
                <li key={link}>
                  <a href="#" className="text-gray-500 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
             ))}
           </ul>
        </div>

        {/* Social */}
        <div>
           <h4 className="font-semibold text-gray-200 mb-4">Social</h4>
           <ul className="space-y-3">
             {links.social.map(item => (
                <li key={item.name}>
                  <a href="#" className="text-gray-500 hover:text-white transition-colors flex items-center gap-2">
                    <item.icon size={14} /> {item.name}
                  </a>
                </li>
             ))}
           </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center text-gray-600 text-xs">
         © 2025 x-and - All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;