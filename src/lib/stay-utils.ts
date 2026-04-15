import { ReservationStatus } from "@prisma/client";

export type StayStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'ACTION_REQUIRED' | 'CANCELLED';

export function getStayStatus(
    startDate: Date,
    endDate: Date,
    status: ReservationStatus
): { label: string; color: string; type: StayStatus } {
    const now = new Date();
    
    // Si la reserva no está pagada o aprobada, el estado depende del status de Prisma
    if (status === 'REJECTED' || status === 'CANCELLED') {
        return { label: 'Cancelada', color: 'bg-slate-100 text-slate-500', type: 'CANCELLED' };
    }
    
    if (status === 'PENDING') {
        return { label: 'Esperando Aprobación', color: 'bg-amber-100 text-amber-700', type: 'ACTION_REQUIRED' };
    }

    if (status === 'APPROVED') {
        return { label: 'Aprobada (Falta Pago)', color: 'bg-blue-100 text-blue-700', type: 'ACTION_REQUIRED' };
    }

    // Si está pagada (PAID), calculamos según la fecha
    if (status === 'PAID') {
        if (now < startDate) {
            return { label: 'Próximamente', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', type: 'UPCOMING' };
        } else if (now >= startDate && now <= endDate) {
            return { label: 'En Curso ⛺', color: 'bg-emerald-600 text-white border-emerald-700 shadow-sm animate-pulse', type: 'ONGOING' };
        } else {
            return { label: 'Finalizada', color: 'bg-slate-700 text-slate-100 border-slate-800', type: 'COMPLETED' };
        }
    }

    return { label: 'Desconocido', color: 'bg-slate-100 text-slate-500', type: 'CANCELLED' };
}
