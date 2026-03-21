"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ReservationStatus } from "@prisma/client";

export default function ClientSearchForm({
    initialSearch,
    initialStatus
}: {
    initialSearch: string;
    initialStatus?: ReservationStatus;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(initialSearch);
    const [status, setStatus] = useState<ReservationStatus | "ALL">(initialStatus || "ALL");

    // Debounce search update
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams);

            if (search) {
                params.set("search", search);
            } else {
                params.delete("search");
            }

            if (status !== "ALL") {
                params.set("status", status);
            } else {
                params.delete("status");
            }

            router.push(`${pathname}?${params.toString()}`);
        }, 300); // 300ms delay

        return () => clearTimeout(timer);
    }, [search, status, pathname, router, searchParams]);

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input
                    type="text"
                    placeholder="Buscar por nombre o correo electrónico..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
                />
            </div>

            <div className="min-w-[200px] w-full md:w-auto">
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ReservationStatus | "ALL")}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-700 cursor-pointer"
                >
                    <option value="ALL">Todas las Reservas</option>
                    <option value="PENDING">Pendientes</option>
                    <option value="APPROVED">Aprobadas</option>
                    <option value="PAID">Confirmadas</option>
                    <option value="REJECTED">Rechazadas</option>
                    <option value="CANCELLED">Canceladas</option>
                </select>
            </div>
        </div>
    );
}
