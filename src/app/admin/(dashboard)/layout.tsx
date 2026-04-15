import Link from "next/link";
import { getSession } from "@/lib/session";
import { logoutAdmin } from "@/app/admin/login/actions";
import { prisma } from "@/lib/prisma";
import AdminMobileMenu from "@/components/admin/AdminMobileMenu";

// SVG Icons for sidebar
function DashboardIcon() {
    return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
}
function SpacesIcon() {
    return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}
function CalendarIcon() {
    return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
}
function UsersIcon() {
    return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}
function SettingsIcon() {
    return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}
function BellIcon() {
    return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
}

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession("ADMIN");
    const adminName = session?.name || "Administrador";
    const pendingCount = await prisma.reservation.count({
        where: { status: "PENDING" }
    });

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-[family-name:var(--font-geist-sans)]">
            {/* Desktop Sidebar (Hidden on Mobile) */}
            <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 min-h-screen shrink-0 border-r border-slate-800 flex-col">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                            C
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">Admin<span className="text-emerald-500">Panel</span></span>
                    </div>
                </div>
                <nav className="p-4 flex flex-col gap-1.5 overflow-y-auto">
                    <Link href="/admin" className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-colors flex items-center gap-3">
                        <DashboardIcon /> Dashboard
                    </Link>
                    <Link href="/admin/espacios" className="px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3">
                        <SpacesIcon /> Espacios
                    </Link>
                    <Link href="/admin/reservas" className="px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3">
                        <CalendarIcon /> Reservaciones
                        {pendingCount > 0 && (
                            <span className="ml-auto w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                {pendingCount}
                            </span>
                        )}
                    </Link>
                    <Link href="/admin/clientes" className="px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3">
                        <UsersIcon /> Clientes
                    </Link>
                    <Link href="/admin/configuracion" className="px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3">
                        <SettingsIcon /> Configuración
                    </Link>
                </nav>

                {/* User Info / Logout (Desktop) */}
                <div className="p-4 mt-auto border-t border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-medium text-white uppercase">
                            {adminName.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white line-clamp-1">{adminName}</p>
                            <form action={logoutAdmin}>
                                <button type="submit" className="text-xs text-slate-500 hover:text-red-400 transition-colors">Cerrar Sesión</button>
                            </form>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto">
                {/* Topbar (Responsive) */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-[50]">
                    <div className="flex items-center gap-3">
                        {/* Componente del Menú Móvil */}
                        <AdminMobileMenu 
                            pendingCount={pendingCount} 
                            adminName={adminName} 
                            logoutAction={logoutAdmin} 
                        />
                        <h2 className="text-base md:text-lg font-semibold text-slate-800 truncate">Panel de Control</h2>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <Link href="/admin/reservas" className="text-slate-400 hover:text-emerald-600 transition-colors relative p-2" aria-label="Notificaciones">
                            <BellIcon />
                            {pendingCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce">
                                    {pendingCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 md:p-8 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
