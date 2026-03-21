"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface HeaderClientProps {
    session: any | null;
}

export default function HeaderClient({ session }: HeaderClientProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hasShadow, setHasShadow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setHasShadow(true);
            } else {
                setHasShadow(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);



    return (
        <header className={`fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-shadow duration-300 ${hasShadow ? 'shadow-md' : ''}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95" onClick={() => setIsMenuOpen(false)}>
                    <div className="w-8 h-8 rounded bg-emerald-600 flex items-center justify-center text-white font-bold text-xl">
                        C
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">Camping<span className="text-emerald-600">Huerta</span></span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-8">
                    <Link href="/nosotros" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Nosotros</Link>
                    <Link href="/espacios" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Espacios</Link>
                    <Link href="/galeria" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Galería</Link>
                    <Link href="/contacto" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors">Contacto</Link>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    {session ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-emerald-700">
                                ¡Hola, {session.name || 'Amigo'}!
                            </span>
                            <Link href="/perfil" className="text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors">
                                Mi Perfil
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                            Iniciar Sesión
                        </Link>
                    )}
                    <Link href={session ? "/espacios" : "/login"} className="px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-600/20 active:scale-95">
                        Reservar Ahora
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-gray-600 hover:text-emerald-600 focus:outline-none p-2"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="sr-only">Abrir menú principal</span>
                        {!isMenuOpen ? (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu — animated via CSS max-height */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                }`}
            >
                <div className="bg-white border-b border-gray-100 shadow-lg">
                    <div className="px-4 pt-2 pb-6 space-y-4">
                        <nav className="flex flex-col space-y-3">
                            <Link href="/nosotros" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-md transition-colors">Nosotros</Link>
                            <Link href="/espacios" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-md transition-colors">Espacios</Link>
                            <Link href="/galeria" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-md transition-colors">Galería</Link>
                            <Link href="/contacto" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded-md transition-colors">Contacto</Link>
                        </nav>

                        <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
                            {session ? (
                                <>
                                    <div className="px-3 py-2">
                                        <span className="text-base font-medium text-emerald-700">
                                            ¡Hola, {session.name || 'Amigo'}!
                                        </span>
                                    </div>
                                    <Link href="/perfil" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-emerald-600 hover:bg-gray-50 rounded-md transition-colors">
                                        Mi Perfil
                                    </Link>
                                </>
                            ) : (
                                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
                                    Iniciar Sesión
                                </Link>
                            )}
                            <div className="px-3 pt-2">
                                <Link href={session ? "/espacios" : "/login"} onClick={() => setIsMenuOpen(false)} className="w-full flex justify-center px-5 py-3 rounded-full bg-emerald-600 text-white text-base font-medium hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-600/20 active:scale-95">
                                    Reservar Ahora
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
