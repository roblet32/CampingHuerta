"use client";

import { useTransition, useState } from "react";
import { createInternalAdmin } from "./actions";

export default function AdminCreationForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            try {
                setError(null);
                setSuccess(false);
                await createInternalAdmin(formData);
                setSuccess(true);
                e.currentTarget.reset();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Ocurrió un error al registrar al administrador.");
            }
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            <div className="p-6 border-b border-slate-100 bg-emerald-50/50">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span>➕</span> Nuevo Admin
                </h3>
            </div>
            <div className="p-6">
                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-sm text-center font-medium">
                        ¡Administrador creado exitosamente!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white text-sm"
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
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white text-sm"
                            placeholder="correo@campinghuerta.com"
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
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-800 bg-gray-50 focus:bg-white text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isPending}
                            className={`w-full text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-sm text-sm ${isPending
                                ? "bg-emerald-400 cursor-not-allowed"
                                : "bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]"
                                }`}
                        >
                            {isPending ? "Agregando..." : "Agregar Cuenta"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
