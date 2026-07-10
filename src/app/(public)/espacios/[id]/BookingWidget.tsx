"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createReservationAction } from "./actions";

export default function BookingWidget({
    spaceId,
    spaceName,
    price,
    capacity,
    isAvailable,
    isLoggedIn
}: {
    spaceId: string;
    spaceName: string;
    price: number;
    capacity: number;
    isAvailable: boolean;
    isLoggedIn: boolean;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [minDate] = useState(() => new Date().toISOString().split("T")[0]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [guests, setGuests] = useState(1);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Cálculos simples de prueba
    const sDate = startDate ? new Date(startDate) : null;
    const eDate = endDate ? new Date(endDate) : null;
    let nights = 0;

    if (sDate && eDate && eDate > sDate) {
        const diffTime = Math.abs(eDate.getTime() - sDate.getTime());
        nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    const totalPrice = nights > 0 ? nights * price : price;

    const handleReserve = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!isLoggedIn) {
            router.push(`/login?redirect=/espacios/${spaceId}`);
            return;
        }

        if (!startDate || !endDate) {
            setError("Por favor selecciona las fechas de tu estadía.");
            return;
        }

        if (new Date(startDate) >= new Date(endDate)) {
            setError("La fecha de salida debe ser posterior a la de llegada.");
            return;
        }

        startTransition(async () => {
            const formData = new FormData();
            formData.append("spaceId", spaceId);
            formData.append("startDate", startDate);
            formData.append("endDate", endDate);
            formData.append("guests", guests.toString());

            const result = await createReservationAction(formData);

            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(true);
                // Redirect user to their profile after a short delay
                setTimeout(() => {
                    router.push("/perfil");
                }, 2000);
            }
        });
    };

    if (success) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 shadow-lg text-center transform transition-all">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-3xl mx-auto mb-4">
                    ✓
                </div>
                <h3 className="text-2xl font-bold text-emerald-900 mb-2">¡Solicitud Enviada!</h3>
                <p className="text-emerald-700">Tu petición para <strong>{spaceName}</strong> ha sido recibida y está pendiente de aprobación por el administrador.</p>
                <p className="text-sm font-medium mt-6 text-emerald-600">Redirigiendo a tu perfil...</p>
            </div>
        );
    }

    return (
        <div className="bg-white border text-center lg:text-left border-slate-200 rounded-3xl p-6 lg:p-8 shadow-xl shadow-slate-200/50">
            <div className="flex justify-between items-end border-b border-slate-100 pb-6 mb-6">
                <div>
                    <span className="text-3xl font-extrabold text-slate-900">${price}</span>
                    <span className="text-slate-500 font-medium"> / noche</span>
                </div>
                {!isAvailable && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider">
                        No Disponible
                    </span>
                )}
            </div>

            <form onSubmit={handleReserve} className="space-y-4 lg:space-y-5">
                {/* Fechas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                    <div>
                        <label className="block text-[10px] lg:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 lg:mb-2">
                            Llegada
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            min={minDate}
                            disabled={!isAvailable || isPending}
                            className="w-full px-3 lg:px-4 py-2.5 lg:py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm lg:text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all hover:bg-white"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] lg:text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 lg:mb-2">
                            Salida
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate || minDate}
                            disabled={!isAvailable || isPending}
                            className="w-full px-3 lg:px-4 py-2.5 lg:py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm lg:text-base text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all hover:bg-white"
                        />
                    </div>
                </div>

                {/* Huespedes */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Huéspedes ({capacity} máximo)
                    </label>
                    <select
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        disabled={!isAvailable || isPending}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer hover:bg-white appearance-none"
                    >
                        {Array.from({ length: capacity }, (_, i) => i + 1).map((num) => (
                            <option key={num} value={num}>
                                {num} {num === 1 ? 'Persona' : 'Personas'}
                            </option>
                        ))}
                    </select>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex gap-2 items-start">
                        <span className="text-red-500">⚠</span>
                        {error}
                    </div>
                )}

                {/* Price Breakdown */}
                {nights > 0 && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex justify-between items-center text-slate-600">
                        <span>${price} x {nights} {nights === 1 ? 'noche' : 'noches'}</span>
                        <span className="font-bold text-slate-900">${totalPrice}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!isAvailable || isPending}
                    className="w-full py-4 px-6 mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isPending ? 'Procesando...' : (!isLoggedIn ? 'Inicia sesión para reservar' : 'Solicitar Reserva')}
                </button>
            </form>
            <div className="mt-6 pt-6 border-t border-slate-100">
                <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Método de Pago Único</p>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-bold text-slate-800">Pagar en Persona / Efectivo</p>
                        <p className="text-[10px] text-slate-500 leading-tight">Liquida tu reserva directamente al llegar al Camping.</p>
                    </div>
                </div>
                <p className="text-center text-[10px] text-slate-400 mt-4 italic">No se requiere tarjeta de crédito ni pago anticipado por el sistema.</p>
            </div>
        </div>
    );
}
