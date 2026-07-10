"use client";

import { useState } from "react";

export default function PaymentInstructionsModal({
    totalPrice
}: {
    reservationId: string;
    totalPrice: number;
}) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="mt-3 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ¿Cómo pagar?
            </button>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 leading-tight">Instrucciones de Pago</h3>
                                <p className="text-slate-500 text-sm mt-1">
                                    Reserva por un total de <strong className="text-blue-600">${totalPrice.toLocaleString()} MXN</strong>
                                </p>
                            </div>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="space-y-6 mb-8">
                            <div className="flex items-start gap-4 p-5 rounded-2xl bg-blue-50 border border-blue-100">
                                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl text-white shadow-lg shrink-0">
                                    🤝
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-lg">Pagar en Persona</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed mt-1">
                                        Tu reservación ya está aprobada. Puedes liquidar el total directamente en la recepción al momento de tu llegada.
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Aviso importante</p>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Una vez que realices el pago, el administrador actualizará tu estado a <strong>&quot;Confirmada&quot;</strong> y recibirás un correo de confirmación final.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full py-4 px-6 bg-slate-900 text-white font-bold rounded-2xl shadow-lg hover:bg-slate-800 transition-all flex justify-center items-center gap-2"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
