
import React, { useState, useEffect } from 'react';
import { CAROUSEL_IMAGES } from '../constants.tsx';

export const Carousel: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden rounded-[3rem] bg-slate-100 group">
      {CAROUSEL_IMAGES.map((img, i) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={img}
            alt={`Slide ${i}`}
            className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-700"
          />
        </div>
      ))}
      
      {/* Navigation Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
        {CAROUSEL_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === index ? 'w-8 bg-white' : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Decorative Text */}
      <div className="absolute top-10 left-10 z-20 pointer-events-none">
        <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] opacity-60">Visual Collection</p>
      </div>
    </div>
  );
};
