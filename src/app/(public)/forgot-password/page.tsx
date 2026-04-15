"use client";

import { useState, useTransition } from "react";
import { forgotPassword } from "./actions";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        setError(undefined);
        setSuccess(undefined);

        startTransition(async () => {
            const data = await forgotPassword(formData);
            setError(data?.error);
            setSuccess(data?.success);
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24 font-[family-name:var(--font-geist-sans)]">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-emerald-800 p-8 text-center text-white">
                    <h1 className="text-2xl font-bold mb-2">¿Olvidaste tu contraseña?</h1>
                    <p className="text-emerald-100 text-sm">No te preocupes, te enviaremos un enlace para restablecerla.</p>
                </div>

                <div className="p-8">
                    {success && (
                        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-sm text-center font-medium">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm text-center font-medium">
                            {error}
                        </div>
                    )}

                    {!success && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Correo Electrónico</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    disabled={isPending}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className={`w-full text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md ${isPending
                                    ? "bg-emerald-400 cursor-not-allowed"
                                    : "bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5"
                                    }`}
                            >
                                {isPending ? "Enviando..." : "Enviar enlace de recuperación"}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <Link href="/login" className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold">
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
