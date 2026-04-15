import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DashboardCalendar from "@/components/admin/DashboardCalendar";

export const dynamic = "force-dynamic";

function CalendarIcon({ className = "w-6 h-6" }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
}
function CurrencyIcon({ className = "w-6 h-6" }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function MapPinIcon({ className = "w-6 h-6" }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}
function UsersIcon({ className = "w-6 h-6" }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}
function TrendUpIcon() {
    return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
}
function ArrowRightIcon() {
    return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>;
}

export default async function AdminDashboard() {
    const totalReservations = await prisma.reservation.count();
    const newClients = await prisma.user.count({ where: { role: 'USER' } });

    // Calculate this month's revenue (APPROVED or PAID reservations)
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyReservations = await prisma.reservation.findMany({
        where: {
            createdAt: { gte: firstDayOfMonth },
            status: { in: ['APPROVED', 'PAID'] }
        },
        include: { space: true }
    });

    const monthlyRevenue = monthlyReservations.reduce((acc, res) => {
        const nights = Math.ceil(Math.abs(res.endDate.getTime() - res.startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
        return acc + (res.space.price * nights);
    }, 0);

    // Get all reservations for the calendar (to show occupancy visually)
    const calendarReservationsRaw = await prisma.reservation.findMany({
        where: {
            OR: [
                { startDate: { gte: firstDayOfMonth } },
                { endDate: { gte: firstDayOfMonth } }
            ]
        },
        include: { user: true, space: true }
    });

    const calendarReservations = calendarReservationsRaw.map(res => ({
        id: res.id,
        userName: res.user.name || "Sin nombre",
        spaceName: res.space.name,
        startDate: res.startDate,
        endDate: res.endDate,
        status: res.status
    }));

    // Calculate today's occupancy
    const totalSpaces = await prisma.space.count({ where: { isAvailable: true } });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const activeReservationsToday = await prisma.reservation.count({
        where: {
            status: { in: ['APPROVED', 'PAID'] },
            startDate: { lte: tomorrow }, // Starts before tomorrow
            endDate: { gte: today }       // Ends after today
        }
    });

    const occupancyRate = totalSpaces > 0 ? Math.round((activeReservationsToday / totalSpaces) * 100) : 0;

    const recentReservations = await prisma.reservation.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true, space: true }
    });

    return (
        <div className="space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Panel Administrativo</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic">Camping Huerta Digital Control Center</p>
                </div>
                <div className="bg-white px-5 py-2.5 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 shadow-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
            </div>

            {/* Stats Cards - Carousel on Mobile, Grid on Desktop */}
            <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 snap-x snap-mandatory scrollbar-hide">
                <div className="min-w-[280px] md:min-w-0 flex-shrink-0 snap-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-32 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Reservas</p>
                            <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{totalReservations}</h3>
                        </div>
                        <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                            <CalendarIcon className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="min-w-[280px] md:min-w-0 flex-shrink-0 snap-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-32 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ingresos (Mes)</p>
                            <h3 className="text-3xl font-black text-slate-800 tracking-tighter">${monthlyRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</h3>
                        </div>
                        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                            <CurrencyIcon className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="min-w-[280px] md:min-w-0 flex-shrink-0 snap-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-32 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ocupación</p>
                            <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{occupancyRate}%</h3>
                        </div>
                        <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
                            <MapPinIcon className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                <div className="min-w-[280px] md:min-w-0 flex-shrink-0 snap-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-32 flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Clientes</p>
                            <h3 className="text-3xl font-black text-slate-800 tracking-tighter">{newClients}</h3>
                        </div>
                        <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                            <UsersIcon className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
                    Calendario de Ocupación
                </h3>
                <DashboardCalendar reservations={calendarReservations} />
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">Reservas Recientes</h3>
                    <Link href="/admin/reservas" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-1">
                        Ver todas <ArrowRightIcon />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 border-collapse">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Espacio</th>
                                <th className="px-6 py-4">Fechas</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentReservations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium bg-slate-50/50">
                                        No hay reservaciones recientes
                                    </td>
                                </tr>
                            ) : (
                                recentReservations.map(res => (
                                    <tr key={res.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900">{res.user.name || "Sin nombre"}</td>
                                        <td className="px-6 py-4 text-slate-500">{res.space.name}</td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {res.startDate.toLocaleDateString()} - {res.endDate.toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                                ${res.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                    res.status === 'APPROVED' ? 'bg-blue-100 text-blue-700' :
                                                        res.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                                                            'bg-slate-100 text-slate-700'}`}>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            ${res.space.price}/n
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
