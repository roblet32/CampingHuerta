import { prisma } from "@/lib/prisma";
import AdminBookingForm from "./AdminBookingForm";

export const dynamic = "force-dynamic";

export default async function AdminNewReservationPage() {
    // Obtener clientes y espacios para los selectores iniciales
    // (En una app con miles de usuarios usaríamos un buscador dinámico, 
    // pero para este camping listar los últimos 100 es eficiente)
    const clients = await prisma.user.findMany({
        where: { role: "USER" },
        orderBy: { name: "asc" },
        take: 100
    });

    const spaces = await prisma.space.findMany({
        where: { isAvailable: true },
        orderBy: { name: "asc" }
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Nueva Reservación Manual</h1>
                    <p className="text-sm text-slate-500">Agrega una reservación directamente al sistema para un cliente físico o vía telefónica.</p>
                </div>
            </div>

            <AdminBookingForm clients={clients} spaces={spaces} />
        </div>
    );
}
