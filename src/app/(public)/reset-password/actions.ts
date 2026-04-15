"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const resetPassword = async (formData: FormData, token: string | null) => {
    if (!token) {
        return { error: "¡Falta el token!" };
    }

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || !confirmPassword) {
        return { error: "Por favor completa todos los campos." };
    }

    if (password !== confirmPassword) {
        return { error: "Las contraseñas no coinciden." };
    }

    if (password.length < 6) {
        return { error: "La contraseña debe tener al menos 6 caracteres." };
    }

    const existingToken = await prisma.passwordResetToken.findUnique({
        where: { token }
    });

    if (!existingToken) {
        return { error: "¡El token no es válido!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "¡El token ha expirado!" };
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: existingToken.email }
    });

    if (!existingUser) {
        return { error: "¡El correo electrónico no existe!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { id: existingUser.id },
        data: { password: hashedPassword }
    });

    await prisma.passwordResetToken.delete({
        where: { id: existingToken.id }
    });

    return { success: "¡Contraseña actualizada correctamente!" };
};
