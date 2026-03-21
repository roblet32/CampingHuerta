import SpaceForm from "@/components/admin/SpaceForm";
import { createSpace } from "../actions";

export default function NewSpacePage() {
    return (
        <div className="space-y-6">
            <div className="mb-8 border-b border-slate-200 pb-4">
                <h1 className="text-2xl font-bold text-slate-800">Crear Nuevo Espacio</h1>
                <p className="text-slate-500 mt-1">Completa los detalles para añadir un nuevo espacio (sitio o cabaña) al catálogo.</p>
            </div>

            <SpaceForm action={createSpace} />
        </div>
    );
}
