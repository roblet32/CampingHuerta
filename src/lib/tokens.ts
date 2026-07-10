import { prisma } from "@/lib/prisma";
import { randomBytes } from "node:crypto";

function generateSecureToken() {
    return randomBytes(32).toString("hex");
}

/**
 * Genera un token de verificación de correo con expiración de 15 minutos.
 */
export const generateVerificationToken = async (email: string) => {
    const token = generateSecureToken();
    const expires = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutos

    const existingToken = await prisma.verificationToken.findFirst({
        where: { email },
    });

    if (existingToken) {
        await prisma.verificationToken.delete({
            where: { id: existingToken.id },
        });
    }

    const verificationToken = await prisma.verificationToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    return verificationToken;
};

/**
 * Genera un token de recuperación de contraseña con expiración de 15 minutos.
 */
export const generatePasswordResetToken = async (email: string) => {
    const token = generateSecureToken();
    const expires = new Date(new Date().getTime() + 15 * 60 * 1000); // 15 minutos

    const existingToken = await prisma.passwordResetToken.findFirst({
        where: { email },
    });

    if (existingToken) {
        await prisma.passwordResetToken.delete({
            where: { id: existingToken.id },
        });
    }

    const passwordResetToken = await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expires,
        },
    });

    return passwordResetToken;
};
