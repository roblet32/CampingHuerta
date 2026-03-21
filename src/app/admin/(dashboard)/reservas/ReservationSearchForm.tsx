"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";

export default function ReservationSearchForm() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const currentSearch = searchParams.get("search") || "";
    const currentStatus = searchParams.get("status") || "ALL";

    const [searchInput, setSearchInput] = useState(currentSearch);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== "ALL") {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            // Reset page if we had pagination
            return params.toString();
        },
        [searchParams]
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(() => {
            router.push(`${pathname}?${createQueryString("search", searchInput)}`);
        });
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        startTransition(() => {
            router.push(`${pathname}?${createQueryString("status", val)}`);
        });
    };

    return (
        <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-grow relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar por cliente, correo o espacio..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
                    />
                </div>

                <div className="sm:w-48 flex-shrink-0">
                    <select
                        value={currentStatus}
                        onChange={handleStatusChange}
                        disabled={isPending}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                    >
                        <option value="ALL">Cualquier Estado</option>
                        <option value="PENDING">Pendientes</option>
                        <option value="APPROVED">Aprobadas</option>
                        <option value="PAID">Pagadas</option>
                        <option value="REJECTED">Rechazadas</option>
                        <option value="CANCELLED">Canceladas</option>
                    </select>
                </div>

                <div className="flex-shrink-0">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full sm:w-auto px-6 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors"
                    >
                        {isPending ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>
            </form>

            {searchParams.get("cliente") && (
                <div className="mt-3 flex items-center justify-between bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                    <span className="text-sm text-emerald-800 font-medium flex items-center gap-2">
                        👤 Filtrando por Cliente Específico
                    </span>
                    <button
                        onClick={() => {
                            startTransition(() => {
                                router.push(`${pathname}?${createQueryString("cliente", "")}`);
                            });
                        }}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-800 px-2 py-1 bg-emerald-100 hover:bg-emerald-200 rounded transition-colors"
                    >
                        Limpiar Filtro
                    </button>
                </div>
            )}
        </div>
    );
}
