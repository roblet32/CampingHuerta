"use client";

import { useTransition } from "react";
import { deleteSpace } from "@/app/admin/(dashboard)/espacios/actions";

export default function DeleteSpaceButton({ id, spaceName }: { id: string, spaceName: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm(`¿Estás seguro de que deseas eliminar el espacio "${spaceName}"? Esta acción no se puede deshacer.`)) {
            startTransition(() => {
                deleteSpace(id);
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className={`p-2 rounded-lg transition-colors ${isPending
                ? "text-slate-300 cursor-not-allowed"
                : "text-slate-400 hover:text-red-600 hover:bg-red-50"
                }`}
            title="Eliminar Espacio"
        >
            {isPending ? "⏳" : "🗑️"}
        </button>
    );
}
