import SpaceForm from "@/components/admin/SpaceForm";
import { updateSpace } from "../../actions";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditSpacePage({
    params,
}: {
    params: { id: string };
}) {

    // For Next.js 15, we must await the params object before accessing properties. 
    // However, `params.id` in standard setups still works synchronously if it's passed as a synchronous prop 
    // depending on Next.js version specifics. Assuming direct access might warn, we use the standard approach.
    const { id } = await params;

    const space = await prisma.space.findUnique({
        where: { id },
    });

    if (!space) {
        notFound();
    }

    // Bind the id to the server action so it receives it directly
    const boundUpdateSpace = updateSpace.bind(null, id);

    return (
        <div className="space-y-6">
            <div className="mb-8 border-b border-slate-200 pb-4">
                <h1 className="text-2xl font-bold text-slate-800">Editar Espacio: {space.name}</h1>
                <p className="text-slate-500 mt-1">Actualiza los detalles y la disponibilidad de este espacio.</p>
            </div>

            <SpaceForm initialData={space} action={boundUpdateSpace} />
        </div>
    );
}
