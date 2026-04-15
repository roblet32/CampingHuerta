"use server";

import { prisma } from "@/lib/prisma";

export const newVerification = async (token: string) => {
    const existingToken = await prisma.verificationToken.findUnique({
        where: { token }
    });

    if (!existingToken) {
        return { error: "¡El token no existe!" };
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

    await prisma.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            email: existingToken.email, // Por si acaso cambió el correo durante el proceso
        }
    });

    await prisma.verificationToken.delete({
        where: { id: existingToken.id }
    });

    return { success: "¡Correo verificado correctamente!" };
};
