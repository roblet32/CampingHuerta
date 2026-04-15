"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

/**
 * Acción para confirmar un método de pago manual (Presencial o OXXO).
 * Actualmente marca la reserva como PAID para propósitos de demostración.
 */
export async function confirmManualPaymentAction(reservationId: string, paymentMethod: string) {
    const session = await getSession("USER");
    
    if (!session || session.role !== "USER") {
        return { error: "No tienes autorización para realizar esta acción." };
    }

    try {
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId }
        });

        if (!reservation || reservation.userId !== session.userId) {
            return { error: "Reserva no encontrada o acceso denegado." };
        }

        if (reservation.status !== "APPROVED") {
            return { error: "La reservación debe estar APROBADA para poder confirmar el pago." };
        }

        console.log(`Confirming manual payment (${paymentMethod}) for reservation: ${reservationId}`);

        // Simulamos un pequeño retraso de procesamiento
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Actualizamos a PAID (En el futuro esto podría ser WAITING_CONFIRMATION si se requiere validar el folio de OXXO)
        await prisma.reservation.update({
            where: { id: reservationId },
            data: { status: "PAID" }
        });

        revalidatePath("/perfil");
        revalidatePath("/admin/reservas");

        return { success: true };
    } catch (error) {
        console.error("Error confirming manual payment:", error);
        return { error: "Ocurrió un error al confirmar el método de pago." };
    }
}
