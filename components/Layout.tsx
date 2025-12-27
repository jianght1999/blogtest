
import React, { useState, useEffect } from 'react';

// Added optional flag to children to resolve TypeScript errors where children are not correctly detected from JSX content
const NavItem = ({ href, children }: { href: string; children?: React.ReactNode }) => (
  <a href={href} className="text-slate-400 hover:text-white transition-colors duration-200 font-medium">
    {children}
  </a>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tighter">
            <span className="text-gradient">FE.</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <NavItem href="#about">About</NavItem>
            <NavItem href="#projects">Projects</NavItem>
            <NavItem href="#skills">Skills</NavItem>
            <NavItem href="#contact">Contact</NavItem>
            <a 
              href="#contact" 
              className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors duration-200 text-sm font-semibold"
            >
              Let's Talk
            </a>
          </div>
        </div>
      </nav>
      <main>{children}</main>
      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">© 2024 FUZZYEEE. Built with Gemini & Tailwind.</p>
          <div className="flex space-x-6 mt-6 md:mt-0">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">GitHub</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
