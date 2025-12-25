
import React from 'react';
import { CAROUSEL_IMAGES } from '../constants.tsx';

export const VisualGallery: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      {CAROUSEL_IMAGES.map((img, i) => (
        <div 
          key={img} 
          className="relative aspect-[4/3] md:aspect-square overflow-hidden rounded-[2.5rem] bg-slate-100 group cursor-crosshair"
        >
          <img
            src={img}
            alt={`Visual ${i}`}
            className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
          />
          <div className="absolute top-8 left-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="text-[10px] font-mono font-black text-white bg-black px-2 py-1 uppercase tracking-widest">
              Ref.{String(i + 1).padStart(2, '0')}
            </span>
          </div>
          <div className="absolute bottom-8 right-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
