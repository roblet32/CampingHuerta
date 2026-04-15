"use client";

import { useState } from "react";

export default function ImageCarousel({ 
    images, 
    fallbackImage, 
    isAvailable 
}: { 
    images: string[], 
    fallbackImage: string, 
    isAvailable: boolean 
}) {
    const validImages = images && images.length > 0 ? images : [fallbackImage];
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % validImages.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    };

    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 mb-10 h-[50vh] min-h-[400px] relative group">
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                style={{ backgroundImage: `url('${validImages[currentIndex]}')` }}
            />
            {!isAvailable && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20">
                    <span className="bg-white/90 text-red-700 font-bold text-xl px-6 py-3 rounded-full shadow-sm">
                        No Disponible
                    </span>
                </div>
            )}
            
            {validImages.length > 1 && (
                <>
                    {/* Left Arrow */}
                    <button 
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg active:scale-95"
                        aria-label="Imagen anterior"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    
                    {/* Right Arrow */}
                    <button 
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-slate-800 p-2.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all z-10 shadow-lg active:scale-95"
                        aria-label="Siguiente imagen"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    
                    {/* Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm">
                        {validImages.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    idx === currentIndex ? "bg-white scale-150 shadow-sm" : "bg-white/60 hover:bg-white/80"
                                }`}
                                aria-label={`Ir a imagen ${idx + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
