"use client";

import { useTransition, useState } from "react";
import { registerClient } from "./actions";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const searchParams = useSearchParams();
    const isSuccess = searchParams.get("success") === "true";
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            try {
                setError(null);
                await registerClient(formData);
            } catch (err: any) {
                setError(err.message || "Ocurrió un error al registrarte.");
            }
        });
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24 font-[family-name:var(--font-geist-sans)]">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Casi listo!</h2>
                    <p className="text-gray-600 mb-8">
                        Hemos enviado un enlace de activación a tu correo electrónico. Por favor revisa tu bandeja de entrada (y la carpeta de spam).
                    </p>
                    <Link href="/login" className="inline-block bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-700 transition-all">
                        Ir al Inicio de Sesión
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24 font-[family-name:var(--font-geist-sans)]">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="bg-emerald-800 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 rounded-full bg-emerald-700/50 blur-2xl z-0"></div>
                    <div className="relative z-10 text-white">
                        <h1 className="text-3xl font-bold tracking-tight mb-2">Crear Cuenta</h1>
                        <p className="text-emerald-100 text-sm">
                            Únete a CampingHuerta y empieza a planear tu próxima aventura en la naturaleza.
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
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre Completo</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                                placeholder="Ej: Ana López"
                            />
                        </div>

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
                                minLength={6}
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
                                {isPending ? "Registrando..." : "Registrarme"}
                            </button>
                        </div>

                        <p className="text-center text-sm text-gray-500 mt-6">
                            ¿Ya tienes una cuenta? <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">Inicia sesión aquí</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
