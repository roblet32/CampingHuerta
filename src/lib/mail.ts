import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY;
const resend = resendKey ? new Resend(resendKey) : null;
const domain = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * Envía un correo electrónico para verificar la cuenta.
 */
export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/new-verification?token=${token}`;

    if (!resend) {
        console.error("Resend API Key is missing. Cannot send verification email.");
        return;
    }

    await resend.emails.send({
        from: "CampingHuerta <onboarding@resend.dev>", // Cambiar por tu dominio verificado en Resend
        to: email,
        subject: "Confirma tu correo electrónico",
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2>¡Bienvenido a CampingHuerta!</h2>
                <p>Para activar tu cuenta, por favor presiona el siguiente botón:</p>
                <a href="${confirmLink}" style="display: inline-block; padding: 10px 20px; background-color: #059669; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Verificar mi cuenta
                </a>
                <p>Este enlace expirará en 15 minutos.</p>
                <p>Si no creaste esta cuenta, puedes ignorar este correo.</p>
            </div>
        `,
    });
};

/**
 * Envía un correo electrónico para restablecer la contraseña.
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `${domain}/reset-password?token=${token}`;

    if (!resend) {
        console.error("Resend API Key is missing. Cannot send password reset email.");
        return;
    }

    await resend.emails.send({
        from: "CampingHuerta <onboarding@resend.dev>",
        to: email,
        subject: "Restablece tu contraseña",
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2>Solicitud de cambio de contraseña</h2>
                <p>Has solicitado restablecer tu contraseña. Presiona el siguiente botón para continuar:</p>
                <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #059669; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Cambiar mi contraseña
                </a>
                <p>Este enlace expirará en 15 minutos.</p>
                <p>Si no solicitaste este cambio, puedes ignorar este correo con seguridad.</p>
            </div>
        `,
    });
};

/**
 * Envía un correo al administrador con los datos del formulario de contacto.
 */
export const sendContactEmail = async (
    name: string, 
    email: string, 
    subject: string, 
    message: string
) => {
    const adminEmail = process.env.CONTACT_EMAIL || "Campinglahuerta@gmail.com";

    if (!resend) {
        throw new Error("El sistema de correos no está configurado. Por favor contacta al administrador.");
    }

    await resend.emails.send({
        from: "Contacto Camping <onboarding@resend.dev>",
        to: adminEmail,
        subject: `Nuevo mensaje: ${subject}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">Nuevo mensaje de contacto</h2>
                <p><strong>De:</strong> ${name} (${email})</p>
                <p><strong>Asunto:</strong> ${subject}</p>
                <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px;">
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
                <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
                <p style="font-size: 12px; color: #666;">Este correo fue enviado desde el formulario de contacto de CampingHuerta.</p>
            </div>
        `,
    });
};
