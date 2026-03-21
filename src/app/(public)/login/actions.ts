"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession } from "@/lib/session";

export async function loginClient(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        throw new Error("Por favor ingresa tu correo y contraseña.");
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("Credenciales incorrectas.");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        throw new Error("Credenciales incorrectas.");
    }

    await createSession({
        userId: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
    });

    // Re-route admins to the admin panel if they log in via the public form by mistake
    if (user.role === "ADMIN") {
        redirect("/admin");
    } else {
        redirect("/");
    }
}

export async function logoutClient() {
    const { deleteSession } = await import("@/lib/session");
    await deleteSession("USER");
    redirect("/");
}
