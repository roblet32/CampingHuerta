"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function createReservationAction(formData: FormData) {
    const session = await getSession("USER");
    if (!session) {
        return { error: "No tienes autorización para realizar esta acción." };
    }

    const spaceId = formData.get("spaceId") as string;
    const startDateStr = formData.get("startDate") as string;
    const endDateStr = formData.get("endDate") as string;
    const guestsStr = formData.get("guests") as string;

    if (!spaceId || !startDateStr || !endDateStr || !guestsStr) {
        return { error: "Todos los campos son obligatorios." };
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    const guests = parseInt(guestsStr, 10);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return { error: "Fechas inválidas." };
    }

    if (startDate >= endDate) {
        return { error: "La fecha de salida debe ser posterior a la de llegada." };
    }

    if (guests < 1) {
        return { error: "Debe haber al menos 1 huésped." };
    }

    try {
        // 1. Check if the space exists and is available
        const space = await prisma.space.findUnique({
            where: { id: spaceId }
        });

        if (!space || !space.isAvailable) {
            return { error: "Este espacio no está disponible." };
        }

        if (guests > space.capacity) {
            return { error: `Este espacio solo tiene capacidad máxima para ${space.capacity} personas.` };
        }

        // 2. Validate overlapping reservations that are not cancelled or rejected
        const overlappingReservations = await prisma.reservation.findMany({
            where: {
                spaceId: spaceId,
                status: {
                    in: ["PENDING", "APPROVED", "PAID"]
                },
                OR: [
                    // Start date falls within an existing reservation
                    { startDate: { lte: startDate }, endDate: { gt: startDate } },
                    // End date falls within an existing reservation
                    { startDate: { lt: endDate }, endDate: { gte: endDate } },
                    // Existing reservation falls entirely within the new dates
                    { startDate: { gte: startDate }, endDate: { lte: endDate } }
                ]
            }
        });

        // Depending on business rules, a CABIN might be exclusive (1 booking = full capacity taken)
        // or a camping area might allow multiple bookings until capacity is reached.
        // The prompt asked: "esto dependera de cuanto cupo disponible tenga el espacio (tambien si otro cliente ya reservo otros cupos y si sobran cupos)"

        let totalGuestsInOverlapping = 0;
        for (const res of overlappingReservations) {
            totalGuestsInOverlapping += res.guests;
        }

        const remainingCapacity = space.capacity - totalGuestsInOverlapping;

        if (guests > remainingCapacity) {
            return { error: `Cupo insuficiente para esas fechas. Solo quedan ${remainingCapacity} ${remainingCapacity === 1 ? 'lugar disponible' : 'lugares disponibles'}.` };
        }

        // 3. Create the Reservation
        await prisma.reservation.create({
            data: {
                userId: session.userId,
                spaceId: spaceId,
                startDate: startDate,
                endDate: endDate,
                guests: guests,
                status: "PENDING"
            }
        });

        revalidatePath(`/espacios/[id]`, "page");
        revalidatePath("/perfil");
        revalidatePath("/admin/reservas");

        return { success: true };

    } catch (error) {
        console.error("Error creating reservation:", error);
        return { error: "Ocurrió un error inesperado al procesar la reserva. Intenta de nuevo." };
    }
}
