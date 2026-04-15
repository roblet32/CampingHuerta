"use client";

import { useTransition, useState } from "react";
import { updateReservationStatusAction, deleteReservationAction } from "./actions";

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
    const [actionType, setActionType] = useState<"APPROVED" | "REJECTED" | "CANCELLED" | "PAID" | "DELETE" | null>(null);

    const handleConfirm = () => {
        if (!actionType) return;
        
        startTransition(async () => {
            let result;
            if (actionType === "DELETE") {
                result = await deleteReservationAction(reservationId);
            } else {
                result = await updateReservationStatusAction(reservationId, actionType);
            }
            
            if (result.error) {
                alert(result.error);
            }
            setShowModal(false);
            setActionType(null);
        });
    };

    const openModal = (status: "APPROVED" | "REJECTED" | "CANCELLED" | "PAID" | "DELETE") => {
        setActionType(status);
        setShowModal(true);
    };

    const actionLabels: Record<string, string> = {
        APPROVED: "Aprobar",
        REJECTED: "Rechazar",
        CANCELLED: "Cancelar",
        PAID: "Confirmar Pago",
        DELETE: "Eliminar"
    };

    return (
        <>
            <div className="flex justify-end items-center gap-2">
                {/* Action Buttons based on status */}
                {currentStatus === "PENDING" && (
                    <>
                        <button
                            onClick={() => openModal("APPROVED")}
                            disabled={isPending}
                            className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
                        >
                            {isPending && actionType === "APPROVED" ? "..." : "Aprobar Reserva"}
                        </button>
                        <button
                            onClick={() => openModal("REJECTED")}
                            disabled={isPending}
                            className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-200 hover:bg-red-100 disabled:opacity-50 transition-colors shadow-sm"
                        >
                            {isPending && actionType === "REJECTED" ? "..." : "Rechazar"}
                        </button>
                    </>
                )}

                {currentStatus === "APPROVED" && (
                    <>
                        <button
                            onClick={() => openModal("PAID")}
                            disabled={isPending}
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md flex items-center gap-1.5 animate-pulse-subtle"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {isPending && actionType === "PAID" ? "..." : "Confirmar Pago"}
                        </button>
                        <button
                            onClick={() => openModal("CANCELLED")}
                            disabled={isPending}
                            className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-200 disabled:opacity-50 transition-colors"
                        >
                            Cancelar
                        </button>
                    </>
                )}

                {/* Final status options */}
                {(currentStatus === "PAID" || currentStatus === "REJECTED" || currentStatus === "CANCELLED") && (
                    <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 font-medium">Venta Finalizada</span>
                        <button
                            onClick={() => openModal("DELETE")}
                            disabled={isPending}
                            className="p-1.5 text-slate-300 hover:text-red-500 transition-colors rounded-lg"
                            title="Eliminar de historial"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {showModal && actionType && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0
                                    ${actionType === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' : 
                                      actionType === 'PAID' ? 'bg-blue-100 text-blue-600' :
                                      actionType === 'DELETE' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}
                                `}>
                                    {actionType === 'APPROVED' && (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                    )}
                                    {actionType === 'PAID' && (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" /></svg>
                                    )}
                                    {actionType === 'REJECTED' && (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                    )}
                                    {actionType === 'DELETE' && (
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-extrabold text-slate-900">¿Estás seguro?</h3>
                                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                        ¿Deseas <strong>{actionLabels[actionType].toLowerCase()}</strong> esta reservación? {actionType === 'DELETE' && "Esta acción no se puede deshacer."}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                            <button
                                onClick={() => { setShowModal(false); setActionType(null); }}
                                disabled={isPending}
                                className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200/50 rounded-xl transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isPending}
                                className={`px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-lg transition-all flex items-center gap-2
                                    ${actionType === 'APPROVED' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 
                                      actionType === 'PAID' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 
                                      actionType === 'DELETE' || actionType === 'REJECTED' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-slate-700 hover:bg-slate-800'}
                                    ${isPending ? 'opacity-70 scale-95' : 'active:scale-95'}
                                `}
                            >
                                {isPending ? 'Procesando...' : `Sí, ${actionLabels[actionType]}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
