"use client";

import { useTransition, useState } from "react";
import { loginClient } from "./actions";
import Link from "next/link";

export default function LoginPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            try {
                setError(null);
                await loginClient(formData);
            } catch (err: any) {
                setError(err.message || "Ocurrió un error al iniciar sesión.");
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-[family-name:var(--font-geist-sans)]">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="bg-emerald-800 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 -ml-10 -mt-10 w-32 h-32 rounded-full bg-emerald-700/50 blur-2xl z-0"></div>
                    <div className="relative z-10 text-white">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Bienvenido de Vuelta</h1>
                        <p className="text-emerald-100 text-sm">
                            Inicia sesión para gestionar tus reservas en CampingHuerta.
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm text-center font-medium">
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
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                                placeholder="correo@ejemplo.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isPending}
                                className={`w-full text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md ${isPending
                                        ? "bg-emerald-400 cursor-not-allowed"
                                        : "bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-0.5"
                                    }`}
                            >
                                {isPending ? "Ingresando..." : "Ingresar"}
                            </button>
                        </div>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            ¿No tienes una cuenta? <Link href="/registro" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">Regístrate aquí</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
