import { prisma } from "@/lib/prisma";
import { ReservationStatus } from "@prisma/client";
import Link from "next/link";
import ClientSearchForm from "./ClientSearchForm";

export const dynamic = 'force-dynamic';

export default async function AdminClientsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; status?: string }>;
}) {
    const params = await searchParams;
    const search = params?.search || "";
    const filterStatus = params?.status as ReservationStatus | undefined;

    // Prisma query for finding clients
    const clients = await prisma.user.findMany({
        where: {
            role: "USER",
            ...(search ? {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ]
            } : {}),
            ...(filterStatus ? {
                reservations: {
                    some: { status: filterStatus }
                }
            } : {})
        },
        include: {
            reservations: {
                orderBy: { startDate: "desc" },
                include: { space: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });

    const statusLabels: Record<string, { label: string, color: string }> = {
        PENDING: { label: "Pendiente", color: "bg-amber-100 text-amber-700 border-amber-200" },
        APPROVED: { label: "Aprobada", color: "bg-blue-100 text-blue-700 border-blue-200" },
        PAID: { label: "Confirmada", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
        CANCELLED: { label: "Cancelada", color: "bg-slate-100 text-slate-700 border-slate-200" }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Directorio de Clientes</h1>
                    <p className="text-sm text-slate-500 mt-1">Busca y administra todos los clientes registrados y sus reservas.</p>
                </div>
            </div>

            {/* Search and Filters */}
            <ClientSearchForm initialSearch={search} initialStatus={filterStatus} />

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden auto-cols-min">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 border-collapse">
                        <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Cliente</th>
                                <th className="px-6 py-4">Información de Contacto</th>
                                <th className="px-6 py-4">Historial de Reservas</th>
                                <th className="px-6 py-4">Estado Más Reciente</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {clients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium bg-slate-50/50">
                                        No se encontraron clientes con esos filtros.
                                    </td>
                                </tr>
                            ) : (
                                clients.map((client) => {
                                    const latestReservation = client.reservations[0];

                                    return (
                                        <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold uppercase shrink-0">
                                                        {client.name?.charAt(0) || "U"}
                                                    </div>
                                                    <span className="font-semibold text-slate-800 text-base">{client.name || "Usuario Sin Nombre"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">{client.email}</a>
                                                <div className="text-xs text-slate-400 mt-1">Registrado: {client.createdAt.toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-slate-700">
                                                    {client.reservations.length} {client.reservations.length === 1 ? 'reserva' : 'reservas'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {latestReservation ? (
                                                    <div className="flex flex-col gap-1 items-start">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusLabels[latestReservation.status]?.color || statusLabels.PENDING.color}`}>
                                                            {statusLabels[latestReservation.status]?.label || latestReservation.status}
                                                        </span>
                                                        <span className="text-xs text-slate-500">{latestReservation.space.name}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 text-sm italic">Sin historial</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link
                                                        href={`/admin/reservas?cliente=${client.id}`}
                                                        className="px-3 py-1.5 text-xs font-medium text-emerald-700 hover:text-white border border-emerald-600 hover:bg-emerald-600 rounded-lg transition-colors"
                                                    >
                                                        Ver Reservas
                                                    </Link>
                                                </div>
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
