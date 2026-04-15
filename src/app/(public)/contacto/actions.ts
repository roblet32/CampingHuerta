"use server";

import { sendContactEmail } from "@/lib/mail";

export async function sendContactMessageAction(formData: FormData) {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    if (!firstName || !email || !subject || !message) {
        return { error: "Por favor completa todos los campos obligatorios." };
    }

    try {
        const fullName = `${firstName} ${lastName}`.trim();
        await sendContactEmail(fullName, email, subject, message);
        return { success: "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto." };
    } catch (error) {
        console.error("Error sending contact message:", error);
        return { error: "Ocurrió un error al enviar tu mensaje. Por favor intenta más tarde." };
    }
}
