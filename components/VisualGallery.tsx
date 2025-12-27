
import React, { useState, useEffect, useRef } from 'react';
import { CAROUSEL_IMAGES } from '../constants.tsx';
import { dataService } from '../services/dataService.ts';

interface VisualGalleryProps {
  isAdmin?: boolean;
}

export const VisualGallery: React.FC<VisualGalleryProps> = ({ isAdmin }) => {
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  useEffect(() => {
    setImages(dataService.getGalleryImages(CAROUSEL_IMAGES));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && replaceIndex !== null) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...images];
        newImages[replaceIndex] = reader.result as string;
        setImages(newImages);
        dataService.saveGalleryImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = (index: number) => {
    if (!isAdmin) return;
    setReplaceIndex(index);
    fileInputRef.current?.click();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange} 
      />
      {images.map((img, i) => (
        <div 
          key={i} 
          onClick={() => triggerUpload(i)}
          className={`relative aspect-[4/3] md:aspect-square overflow-hidden rounded-[2.5rem] bg-slate-100 group ${isAdmin ? 'cursor-pointer' : 'cursor-crosshair'}`}
        >
          <img
            src={img}
            alt={`Visual ${i}`}
            className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
          />
          
          {isAdmin && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest">Update Image</span>
            </div>
          )}

          <div className="absolute top-8 left-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="text-[10px] font-mono font-black text-white bg-black px-2 py-1 uppercase tracking-widest">
              Ref.{String(i + 1).padStart(2, '0')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
