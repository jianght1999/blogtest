
import React from 'react';
import { USER_INFO } from '../constants.tsx';

interface SidebarProps {
  currentSection: string;
  setSection: (section: string) => void;
  isAdmin: boolean;
  onLoginClick: () => void;
  onLogout: () => void;
}

const SidebarIcon = ({ icon }: { icon: React.ReactNode }) => (
  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
    {icon}
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentSection, 
  setSection, 
  isAdmin, 
  onLoginClick,
  onLogout 
}) => {
  const navItems = [
    { id: 'home', label: 'HOME', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { id: 'Tech', label: 'TECH', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /> },
    { id: 'Design', label: 'DESIGN', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
    { id: 'Life', label: 'LIFE', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /> },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen z-50 group">
      <div className="h-full w-20 group-hover:w-60 bg-white border-r border-slate-100 transition-all duration-500 flex flex-col items-start py-10">
        <div className="mb-16 pl-6">
          <div className="w-10 h-10 bg-slate-100 overflow-hidden ring-1 ring-slate-200 transition-all group-hover:w-12 group-hover:h-12">
            <img 
              src={USER_INFO.avatarUrl} 
              alt="Avatar" 
              className="w-full h-full object-cover grayscale brightness-110"
            />
          </div>
        </div>

        <nav className="flex-1 w-full space-y-4 pr-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center pl-7 pr-12 py-4 transition-all duration-300 ${
                currentSection === item.id 
                  ? 'bg-black text-white translate-x-0' 
                  : 'text-slate-300 hover:text-black hover:bg-slate-50'
              }`}
            >
              <SidebarIcon icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                  {item.icon}
                </svg>
              } />
              <span className="ml-6 font-black text-[10px] tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap overflow-hidden">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="w-full mt-auto pr-4">
          <button 
            onClick={isAdmin ? onLogout : onLoginClick}
            className={`w-full flex items-center pl-7 pr-12 py-5 transition-all duration-300 ${
              isAdmin ? 'text-black' : 'text-slate-200 hover:text-black hover:bg-slate-50'
            }`}
          >
            <SidebarIcon icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            } />
            <span className="ml-6 font-black text-[10px] tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500">
              {isAdmin ? 'OUT' : 'ADMIN'}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};
