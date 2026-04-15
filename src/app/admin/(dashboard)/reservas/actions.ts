"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function updateReservationStatusAction(reservationId: string, newStatus: "APPROVED" | "REJECTED" | "CANCELLED" | "PAID") {
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

        return { success: true };
    } catch (error) {
        console.error("Failed to update reservation status:", error);
        return { error: "Ocurrió un error al actualizar el estado de la reserva." };
    }
}

export async function deleteReservationAction(reservationId: string) {
    const session = await getSession("ADMIN");

    if (!session || session.role !== "ADMIN") {
        return { error: "No tienes permisos para realizar esta acción." };
    }

    try {
        await prisma.reservation.delete({
            where: { id: reservationId }
        });

        revalidatePath("/admin/reservas");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete reservation:", error);
        return { error: "No se puede eliminar la reserva. Puede que tenga datos asociados." };
    }
}

export async function createAdminReservationAction(data: {
    userId: string,
    spaceId: string,
    startDate: string,
    endDate: string,
    guests: number,
    status: "APPROVED" | "PAID"
}) {
    const session = await getSession("ADMIN");

    if (!session || session.role !== "ADMIN") {
        return { error: "No tienes permisos para realizar esta acción." };
    }

    try {
        await prisma.reservation.create({
            data: {
                userId: data.userId,
                spaceId: data.spaceId,
                startDate: new Date(data.startDate),
                endDate: new Date(data.endDate),
                guests: data.guests,
                status: data.status,
            }
        });

        revalidatePath("/admin/reservas");
        return { success: true };
    } catch (error) {
        console.error("Failed to create admin reservation:", error);
        return { error: "Error al crear la reserva. Verifica las fechas y los datos del cliente." };
    }
}
