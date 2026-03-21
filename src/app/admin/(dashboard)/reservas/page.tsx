import { prisma } from "@/lib/prisma";
import { Prisma, ReservationStatus } from "@prisma/client";
import ActionsCell from "./ActionsCell";
import ReservationSearchForm from "./ReservationSearchForm";

export const dynamic = "force-dynamic";

function UsersIcon({ className = "w-4 h-4" }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}

export default async function AdminReservationsPage({
    searchParams
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const search = typeof params.search === 'string' ? params.search : "";
    const clienteId = typeof params.cliente === 'string' ? params.cliente : "";
    const statusFilter = typeof params.status === 'string' && params.status !== "ALL" ? params.status as ReservationStatus : undefined;

    const whereClause: Prisma.ReservationWhereInput = {};

    if (search) {
        whereClause.OR = [
            { user: { name: { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
            { space: { name: { contains: search, mode: "insensitive" } } }
        ];
    }

    if (clienteId) {
        whereClause.userId = clienteId;
    }

    if (statusFilter) {
        whereClause.status = statusFilter;
    }

    const reservations = await prisma.reservation.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
            user: true,
            space: true
        }
    });

    const statusLabels: Record<string, { label: string, color: string }> = {
        PENDING: { label: "Pendiente", color: "bg-amber-100 text-amber-700 border-amber-200" },
        APPROVED: { label: "Aprobada", color: "bg-blue-100 text-blue-700 border-blue-200" },
        PAID: { label: "Pagada", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
        REJECTED: { label: "Rechazada", color: "bg-red-100 text-red-700 border-red-200" },
        CANCELLED: { label: "Cancelada", color: "bg-slate-100 text-slate-700 border-slate-200" }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Control de Reservaciones</h1>
                    <p className="text-sm text-slate-500 mt-1">Revisa, aprueba o rechaza solicitudes de clientes.</p>
                </div>
            </div>

            <ReservationSearchForm />

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden auto-cols-min">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 border-collapse">
                        <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">ID de Solicitud</th>
                                <th className="px-6 py-4">Cliente / Contacto</th>
                                <th className="px-6 py-4">Fechas & Detalles</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {reservations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50/50">
                                        No hay reservaciones registradas en el sistema.
                                    </td>
                                </tr>
                            ) : (
                                reservations.map((res) => {
                                    const diffTime = Math.abs(res.endDate.getTime() - res.startDate.getTime());
                                    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                    return (
                                        <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs text-slate-400">
                                                {res.id.slice(-8).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-800">{res.user.name || "Usuario Sin Nombre"}</div>
                                                <div className="text-xs text-blue-600 hover:underline"><a href={`mailto:${res.user.email}`}>{res.user.email}</a></div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-700 mb-1">{res.space.name}</div>
                                                <div className="text-xs text-slate-500">
                                                    {res.startDate.toLocaleDateString()} al {res.endDate.toLocaleDateString()} ({nights} noches)
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                    <UsersIcon className="w-3.5 h-3.5" /> Huéspedes: {res.guests}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusLabels[res.status]?.color || statusLabels.PENDING.color}`}>
                                                    {statusLabels[res.status]?.label || res.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {/* Client Component for Interactive Buttons so we don't block server rendering */}
                                                <ActionsCell reservationId={res.id} currentStatus={res.status} />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
