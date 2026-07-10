"use client";

import { useTransition, useState } from "react";
import { registerAdmin } from "./actions";

export default function AdminTemporaryRegistration() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            try {
                setError(null);
                await registerAdmin(formData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Ocurrió un error al registrar al administrador.");
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Header */}
                <div className="bg-emerald-600 p-6 text-center text-white">
                    <div className="w-12 h-12 rounded-full bg-white text-emerald-600 flex items-center justify-center font-bold text-2xl mx-auto mb-3">
                        C
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Registro de Admin</h1>
                    <p className="text-emerald-100 mt-1 text-sm">
                        Portal temporal para crear la primera cuenta de administrador.
                    </p>
                </div>

                {/* Form */}
                <div className="p-8">
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                                placeholder="Ej: Juan Pérez"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Correo Electrónico</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                                placeholder="admin@campinghuerta.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                minLength={6}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isPending}
                                className={`w-full text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm ${isPending
                                        ? "bg-emerald-400 cursor-not-allowed"
                                        : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]"
                                    }`}
                            >
                                {isPending ? "Creando Administrador..." : "Crear Administrador"}
                            </button>
                        </div>

                        <p className="text-xs text-center text-gray-500 mt-4">
                            Nota: Este portal debe ser desactivado o borrado una vez que los administradores principales sean creados por seguridad.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
