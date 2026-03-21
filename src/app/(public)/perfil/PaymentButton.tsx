"use client";

import { useState, useTransition } from "react";
import { createPreferenceAction } from "./payment-actions";

export default function PaymentButton({
    reservationId,
    totalPrice
}: {
    reservationId: string;
    totalPrice: number;
}) {
    const [isPending, startTransition] = useTransition();
    const [showModal, setShowModal] = useState(false);

    const handleRealPayment = () => {
        startTransition(async () => {
            const result = await createPreferenceAction(reservationId);
            if (result.error) {
                alert(result.error);
                setShowModal(false);
            } else if (result.init_point) {
                // Redirect user to Mercado Pago Checkout Pro
                window.location.href = result.init_point;
            }
        });
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="mt-3 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-sm"
            >
                Pagar con Mercado Pago
            </button>

            {/* Mercado Pago Info Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                💳
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Mercado Pago</h3>
                            <p className="text-slate-500 text-sm mt-2">
                                Serás redirigido para pagar un total de <strong className="text-slate-900">${totalPrice}</strong>. 
                            </p>
                        </div>
                        
                        <div className="space-y-3">
                            <button
                                onClick={handleRealPayment}
                                disabled={isPending}
                                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Generando pago...
                                    </>
                                ) : "Ir a Pagar"}
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={isPending}
                                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
