import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import DeleteSpaceButton from "@/components/admin/DeleteSpaceButton";

export const dynamic = 'force-dynamic';

function UsersIcon({ className = "w-4 h-4" }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
}

function EditIcon({ className = "w-4 h-4" }: { className?: string }) {
    return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;
}

export default async function AdminSpacesPage() {
    const spaces = await prisma.space.findMany({
        orderBy: { createdAt: 'desc' },
    });

    const typeLabels: Record<string, string> = {
        PARKING: "Estacionamiento",
        OPEN_FIELD: "Campo Abierto",
        PALAPA: "Palapa",
        RIVERSIDE: "Cerca del Río",
        HOUSE: "Casa / Cabaña"
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Agendar Espacios</h1>
                    <p className="text-sm text-slate-500 mt-1">Administra los espacios disponibles en el camping.</p>
                </div>
                <Link
                    href="/admin/espacios/nuevo"
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Nuevo Espacio
                </Link>
            </div>

            {spaces.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No hay espacios registrados</h3>
                    <p className="text-slate-500 mb-6">Crea uno nuevo para comenzar a recibir reservas.</p>
                </div>
            ) : (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 border-collapse">
                            <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Información del Espacio</th>
                                    <th className="px-6 py-4">Tipo & Capacidad</th>
                                    <th className="px-6 py-4">Precio (Noche)</th>
                                    <th className="px-6 py-4">Estado</th>
                                    <th className="px-6 py-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {spaces.map((space) => (
                                    <tr key={space.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-800 text-base">{space.name}</span>
                                                <span className="text-xs text-slate-500 truncate max-w-[250px]" title={space.description || ''}>
                                                    {space.description || "Sin descripción"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                                                    {typeLabels[space.type] || space.type}
                                                </span>
                                                <span className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                                    <UsersIcon className="w-3.5 h-3.5" /> Hasta {space.capacity} pax
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-800">
                                            ${space.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border ${space.isAvailable
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                                                : 'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>
                                                {space.isAvailable ? 'Disponible' : 'Oculto'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/admin/espacios/${space.id}/editar`}
                                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors inline-block"
                                                    title="Editar Espacio"
                                                >
                                                    <EditIcon />
                                                </Link>
                                                <DeleteSpaceButton id={space.id} spaceName={space.name} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
