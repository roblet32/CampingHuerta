"use client";

import { useTransition, useState } from "react";
import { updateReservationStatusAction } from "./actions";

export default function ActionsCell({
    reservationId,
    currentStatus
}: {
    reservationId: string;
    currentStatus: string;
}) {
    const [isPending, startTransition] = useTransition();
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState<"APPROVED" | "REJECTED" | "CANCELLED" | null>(null);

    const handleConfirm = () => {
        if (!actionType) return;
        
        startTransition(async () => {
            const result = await updateReservationStatusAction(reservationId, actionType);
            if (result.error) {
                alert(result.error);
            }
            setShowModal(false);
            setActionType(null);
        });
    };

    const openModal = (status: "APPROVED" | "REJECTED" | "CANCELLED") => {
        setActionType(status);
        setShowModal(true);
    };

    const actionLabels: Record<string, string> = {
        APPROVED: "Aprobar",
        REJECTED: "Rechazar",
        CANCELLED: "Cancelar"
    };

    return (
        <>
            {/* Action Buttons */}
            {currentStatus === "PENDING" && (
                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => openModal("APPROVED")}
                        disabled={isPending}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {isPending && actionType === "APPROVED" ? "..." : "Aprobar"}
                    </button>
                    <button
                        onClick={() => openModal("REJECTED")}
                        disabled={isPending}
                        className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {isPending && actionType === "REJECTED" ? "..." : "Rechazar"}
                    </button>
                </div>
            )}

            {currentStatus === "APPROVED" && (
                <div className="flex justify-end gap-2 items-center">
                    <span className="text-xs text-slate-400 italic font-medium px-2 py-1">
                        Esperando Pago
                    </span>
                    <button
                        onClick={() => openModal("CANCELLED")}
                        disabled={isPending}
                        className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-200 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {isPending && actionType === "CANCELLED" ? "..." : "Cancelar"}
                    </button>
                </div>
            )}

            {/* No Actions state */}
            {(currentStatus === "PAID" || currentStatus === "REJECTED" || currentStatus === "CANCELLED") && (
                <div className="flex justify-end">
                    <span className="text-xs text-slate-400 font-medium">Sin acciones extra</span>
                </div>
            )}

            {/* Confirmation Modal */}
            {showModal && actionType && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                                    ${actionType === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 
                                      actionType === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}
                                `}>
                                    {actionType === 'APPROVED' && (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                    )}
                                    {actionType === 'REJECTED' && (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                    )}
                                    {actionType === 'CANCELLED' && (
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Confirmar Acción</h3>
                                    <p className="text-sm text-slate-500 mt-0.5">
                                        ¿Estás seguro de que deseas <strong className="text-slate-700">{actionLabels[actionType].toLowerCase()}</strong> esta reservación?
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => { setShowModal(false); setActionType(null); }}
                                disabled={isPending}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
                            >
                                Volver
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isPending}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-colors flex items-center gap-2
                                    ${actionType === 'APPROVED' ? 'bg-emerald-600 hover:bg-emerald-700' : 
                                      actionType === 'REJECTED' ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-700 hover:bg-slate-800'}
                                    ${isPending ? 'opacity-70 cursor-not-allowed' : ''}
                                `}
                            >
                                {isPending && (
                                    <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                )}
                                Sí, {actionLabels[actionType]}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
