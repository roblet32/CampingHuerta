"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { mpClient } from "@/lib/mercadopago";
import { Preference } from "mercadopago";

export async function createPreferenceAction(reservationId: string) {
    const session = await getSession("USER");
    
    if (!session || session.role !== "USER") {
        return { error: "No tienes autorización para realizar esta acción." };
    }

    try {
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId },
            include: { space: true }
        });

        if (!reservation || reservation.userId !== session.userId) {
            return { error: "Reserva no encontrada o acceso denegado." };
        }

        if (reservation.status !== "APPROVED") {
            return { error: "La reservación debe estar APROBADA para poder pagarla." };
        }

        // Calculate nights
        const diff = Math.abs(reservation.endDate.getTime() - reservation.startDate.getTime());
        const nights = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
        const totalAmount = reservation.space.price * nights;

        // Create Mercado Pago Preference
        const preference = new Preference(mpClient);
        
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const webhookUrl = process.env.WEBHOOK_URL;
        
        // Use ngrok URL for back_urls too if we are in dev, because MP often rejects localhost for auto_return
        const effectiveBackUrl = webhookUrl || baseUrl;

        console.log("Creating preference with:", {
            baseUrl,
            webhookUrl,
            effectiveBackUrl,
            reservationId: reservation.id
        });

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: reservation.id,
                        title: `Estadía en ${reservation.space.name}`,
                        quantity: 1,
                        unit_price: totalAmount,
                        currency_id: 'MXN'
                    }
                ],
                back_urls: {
                    success: `${effectiveBackUrl}/perfil?status=success`,
                    failure: `${effectiveBackUrl}/perfil?status=failure`,
                    pending: `${effectiveBackUrl}/perfil?status=pending`,
                },
                auto_return: 'approved',
                notification_url: webhookUrl ? `${webhookUrl}/api/webhooks/mercadopago` : undefined,
                external_reference: reservation.id,
                metadata: {
                    reservationId: reservation.id
                }
            }
        });

        console.log("Preference created successfully:", result.id);
        return { init_point: result.init_point, preferenceId: result.id };
    } catch (error) {
        console.error("Error creating MP preference:", error);
        return { error: "No se pudo generar la preferencia de pago. Verifica tus credenciales." };
    }
}

export async function processMockPaymentAction(reservationId: string) {
    const session = await getSession("USER");

    if (!session || session.role !== "USER") {
        return { error: "No tienes autorización para realizar esta acción." };
    }

    try {
        // Verify the reservation belongs to the user and is APPROVED
        const reservation = await prisma.reservation.findUnique({
            where: { id: reservationId }
        });

        if (!reservation || reservation.userId !== session.userId) {
            return { error: "Reserva no encontrada o acceso denegado." };
        }

        if (reservation.status !== "APPROVED") {
            return { error: "La reservación no se encuentra en estado APROBADA para proceder con el pago." };
        }

        // Simulate a payment process delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Update to PAID
        await prisma.reservation.update({
            where: { id: reservationId },
            data: { status: "PAID" }
        });

        revalidatePath("/perfil");
        revalidatePath("/admin/reservas");

        return { success: true };
    } catch (error) {
        console.error("Mock payment failed:", error);
        return { error: "Ocurrió un error al procesar el pago simulado." };
    }
}
