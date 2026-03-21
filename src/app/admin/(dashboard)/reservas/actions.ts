"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function updateReservationStatusAction(reservationId: string, newStatus: "APPROVED" | "REJECTED" | "CANCELLED") {
    const session = await getSession("ADMIN");

    if (!session || session.role !== "ADMIN") {
        return { error: "No tienes permisos para realizar esta acción." };
    }

    try {
        await prisma.reservation.update({
            where: { id: reservationId },
            data: { status: newStatus }
        });

        revalidatePath("/admin");
        revalidatePath("/admin/reservas");
        revalidatePath("/admin/clientes");

        return { success: true };
    } catch (error) {
        console.error("Failed to update reservation status:", error);
        return { error: "Ocurrió un error al actualizar el estado de la reserva." };
    }
}
