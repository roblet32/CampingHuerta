"use client";

import { useTransition, useState } from "react";
import { loginAdmin } from "./actions";

export default function AdminLogin() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            try {
                setError(null);
                await loginAdmin(formData);
            } catch (err: any) {
                setError(err.message || "Credenciales incorrectas.");
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Header */}
                <div className="bg-slate-900 p-8 text-center text-white">
                    <div className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-3xl mx-auto mb-4">
                        C
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Acceso Administrador</h1>
                    <p className="text-slate-400 mt-2 text-sm">
                        Ingresa tus credenciales para gestionar CampingHuerta.
                    </p>
                </div>

                {/* Form */}
                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm text-center font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                                placeholder="admin@campinghuerta.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isPending}
                                className={`w-full text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-sm ${isPending
                                    ? "bg-emerald-400 cursor-not-allowed"
                                    : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]"
                                    }`}
                            >
                                {isPending ? "Ingresando..." : "Iniciar Sesión"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
