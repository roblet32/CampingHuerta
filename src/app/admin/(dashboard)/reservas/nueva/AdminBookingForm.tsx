"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createAdminReservationAction } from "../actions";

interface AdminBookingFormProps {
    clients: { id: string, name: string | null, email: string }[];
    spaces: { id: string, name: string, price: number, capacity: number }[];
}

export default function AdminBookingForm({ clients, spaces }: AdminBookingFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // Form State
    const [clientId, setClientId] = useState("");
    const [spaceId, setSpaceId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [guests, setGuests] = useState(1);
    const [status, setStatus] = useState<"APPROVED" | "PAID">("APPROVED");
    const [error, setError] = useState("");

    // Helpers
    const selectedSpace = spaces.find(s => s.id === spaceId);
    
    // Total price calculation
    let total = 0;
    if (selectedSpace && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end > start) {
            const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            total = nights * selectedSpace.price;
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!clientId || !spaceId || !startDate || !endDate) {
            setError("Por favor completa todos los campos.");
            return;
        }

        startTransition(async () => {
            const result = await createAdminReservationAction({
                userId: clientId,
                spaceId,
                startDate,
                endDate,
                guests,
                status
            });

            if (result.error) {
                setError(result.error);
            } else {
                router.push("/admin/reservas");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-8 space-y-8">
                {/* Cliente y Espacio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Cliente</label>
                        <select
                            value={clientId}
                            onChange={(e) => setClientId(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            required
                        >
                            <option value="">Selecciona un cliente...</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.name || "Sin nombre"} ({c.email})</option>
                            ))}
                        </select>
                        <p className="text-[10px] text-slate-400 ml-1">Solo clientes registrados aparecen aquí.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Espacio / Alojamiento</label>
                        <select
                            value={spaceId}
                            onChange={(e) => setSpaceId(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            required
                        >
                            <option value="">Selecciona un lugar...</option>
                            {spaces.map(s => (
                                <option key={s.id} value={s.id}>{s.name} (${s.price}/noche)</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Fecha de Entrada</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Fecha de Salida</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            required
                        />
                    </div>
                </div>

                {/* Huespedes y Estado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Huéspedes</label>
                        <input
                            type="number"
                            min="1"
                            max={selectedSpace?.capacity || 20}
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Estado Inicial</label>
                        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                            <button
                                type="button"
                                onClick={() => setStatus("APPROVED")}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${status === 'APPROVED' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Confirmado (Pendiente de Pago)
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatus("PAID")}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${status === 'PAID' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Pagado (Venta Cerrada)
                            </button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-medium flex gap-2 items-center">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        {error}
                    </div>
                )}
            </div>

            {/* Footer / Resumen */}
            <div className="bg-slate-50 p-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Monto Total Estimado</p>
                    <h2 className="text-3xl font-black text-slate-900">${total.toLocaleString()} MXN</h2>
                </div>
                
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex-1 md:flex-none px-10 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isPending ? 'Guardando...' : 'Registrar Reservación'}
                    </button>
                </div>
            </div>
        </form>
    );
}
