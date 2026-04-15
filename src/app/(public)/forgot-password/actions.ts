"use server";

import { prisma } from "@/lib/prisma";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export const forgotPassword = async (formData: FormData) => {
    const email = formData.get("email") as string;

    if (!email) {
        return { error: "El correo electrónico es requerido." };
    }

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (!existingUser) {
        // Por seguridad, no revelamos si el correo existe o no
        return { success: "Si el correo está registrado, recibirás un enlace de recuperación." };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
    );

    return { success: "Si el correo está registrado, recibirás un enlace de recuperación." };
};
