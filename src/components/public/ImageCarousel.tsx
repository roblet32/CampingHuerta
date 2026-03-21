"use client";

import { useState, useEffect, useCallback } from "react";

interface CarouselImage {
    id: number | string;
    src: string;
    alt: string;
}

interface ImageCarouselProps {
    images: CarouselImage[];
    autoPlay?: boolean;
    interval?: number;
}

function ChevronLeftIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M15 18l-6-6 6-6" />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M9 18l6-6-6-6" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M18 6L6 18M6 6l12 12" />
        </svg>
    );
}

export default function ImageCarousel({ images, autoPlay = false, interval = 4000 }: ImageCarouselProps) {
    const [current, setCurrent] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const goTo = useCallback((index: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrent((index + images.length) % images.length);
        setTimeout(() => setIsTransitioning(false), 500);
    }, [isTransitioning, images.length]);

    const prev = useCallback(() => goTo(current - 1), [current, goTo]);
    const next = useCallback(() => goTo(current + 1), [current, goTo]);

    useEffect(() => {
        if (!autoPlay || lightboxOpen) return;
        const timer = setInterval(next, interval);
        return () => clearInterval(timer);
    }, [autoPlay, interval, next, lightboxOpen]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;
            if (e.key === "ArrowLeft") setLightboxIndex(i => (i - 1 + images.length) % images.length);
            if (e.key === "ArrowRight") setLightboxIndex(i => (i + 1) % images.length);
            if (e.key === "Escape") setLightboxOpen(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [lightboxOpen, images.length]);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    if (images.length === 0) return null;

    return (
        <>
            {/* Main Carousel */}
            <div className="relative w-full overflow-hidden rounded-3xl shadow-2xl select-none">
                {/* Slide Track */}
                <div className="relative h-[420px] md:h-[560px]">
                    {images.map((img, i) => (
                        <div
                            key={img.id}
                            onClick={() => openLightbox(i)}
                            className={`absolute inset-0 cursor-pointer transition-opacity duration-500 ease-in-out ${i === current ? "opacity-100 z-10" : "opacity-0 z-0"}`}
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-100 hover:scale-105"
                                style={{ backgroundImage: `url('${img.src}')` }}
                                aria-label={img.alt}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-8 right-8">
                                <span className="text-white font-semibold text-lg drop-shadow-lg">{img.alt}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full p-3 hover:bg-white/40 transition-all shadow-lg"
                            aria-label="Anterior"
                        >
                            <ChevronLeftIcon />
                        </button>
                        <button
                            onClick={next}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full p-3 hover:bg-white/40 transition-all shadow-lg"
                            aria-label="Siguiente"
                        >
                            <ChevronRightIcon />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-4 right-1/2 translate-x-1/2 z-20 flex gap-2">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    aria-label={`Ir a imagen ${i + 1}`}
                                    className={`rounded-full transition-all duration-300 ${i === current ? "bg-white w-6 h-2.5" : "bg-white/50 w-2.5 h-2.5 hover:bg-white/80"}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                        <button
                            key={img.id}
                            onClick={() => goTo(i)}
                            className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden transition-all duration-300 ${i === current ? "ring-2 ring-emerald-500 opacity-100 scale-105" : "opacity-50 hover:opacity-80"}`}
                        >
                            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${img.src}')` }} />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setLightboxOpen(false)}
                >
                    <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
                        <div
                            className="w-full h-[70vh] bg-contain bg-center bg-no-repeat transition-all duration-300"
                            style={{ backgroundImage: `url('${images[lightboxIndex].src}')` }}
                        />
                        <p className="text-center text-white/80 mt-4 text-sm">{images[lightboxIndex].alt}</p>
                        <button
                            onClick={() => setLightboxOpen(false)}
                            className="absolute -top-4 -right-4 bg-white/10 hover:bg-white/30 text-white rounded-full p-2 transition-all"
                            aria-label="Cerrar"
                        >
                            <XIcon />
                        </button>
                        <button onClick={() => setLightboxIndex(i => (i - 1 + images.length) % images.length)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white/10 hover:bg-white/30 text-white rounded-full p-3 transition-all" aria-label="Anterior"><ChevronLeftIcon /></button>
                        <button onClick={() => setLightboxIndex(i => (i + 1) % images.length)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white/10 hover:bg-white/30 text-white rounded-full p-3 transition-all" aria-label="Siguiente"><ChevronRightIcon /></button>
                    </div>
                </div>
            )}
        </>
    );
}
