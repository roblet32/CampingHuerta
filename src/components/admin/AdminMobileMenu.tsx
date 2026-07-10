"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminMobileMenuProps {
    pendingCount: number;
    adminName: string;
    logoutAction: () => void;
}

export default function AdminMobileMenu({ pendingCount, adminName, logoutAction }: AdminMobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Bloquear scroll cuando el menú está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const menuItems = [
        { href: "/admin", label: "Dashboard", icon: <DashboardIcon /> },
        { href: "/admin/espacios", label: "Espacios", icon: <SpacesIcon /> },
        { href: "/admin/reservas", label: "Reservaciones", icon: <CalendarIcon />, badge: pendingCount },
        { href: "/admin/clientes", label: "Clientes", icon: <UsersIcon /> },
        { href: "/admin/configuracion", label: "Configuración", icon: <SettingsIcon /> },
    ];

    return (
        <>
            {/* Botón Hamburguesa */}
            <button 
                onClick={() => setIsOpen(true)}
                className="p-2 -ml-2 text-slate-600 md:hidden hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Abrir menú"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Overlay y Menú */}
            <div 
                className={`fixed inset-0 z-[100] transition-opacity duration-300 md:hidden ${
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            >
                {/* Backdrop Negro con Blur */}
                <div 
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />

                {/* Contenido del Menú (Slide from Left) */}
                <aside 
                    className={`absolute inset-y-0 left-0 w-[280px] bg-slate-900 shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
                        isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    {/* Header del Menú */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                                C
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight">Admin<span className="text-emerald-500">Panel</span></span>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-2 -mr-2 text-slate-400 hover:text-white"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Enlaces */}
                    <nav className="flex-1 p-4 flex flex-col gap-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link 
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                        isActive 
                                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" 
                                            : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    }`}
                                >
                                    {item.icon}
                                    <span className="font-medium">{item.label}</span>
                                    {item.badge ? (
                                        <span className={`ml-auto w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center ${
                                            isActive ? "bg-white text-emerald-600" : "bg-emerald-500 text-white"
                                        }`}>
                                            {item.badge}
                                        </span>
                                    ) : null}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer del Menú (Usuario) */}
                    <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                        <div className="flex items-center gap-3 px-2 py-2">
                            <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-bold text-white uppercase shadow-inner">
                                {adminName ? adminName.charAt(0) : "A"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{adminName || "Administrador"}</p>
                                <button 
                                    onClick={logoutAction}
                                    className="text-xs text-red-400 font-medium hover:text-red-300"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </>
    );
}

// Iconos Duplicados pero necesarios para el componente encapsulado
function DashboardIcon() { return <svg className="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>; }
function SpacesIcon() { return <svg className="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>; }
function CalendarIcon() { return <svg className="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>; }
function UsersIcon() { return <svg className="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>; }
function SettingsIcon() { return <svg className="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>; }
