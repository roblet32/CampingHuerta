"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/session";

export async function loginAdmin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        throw new Error("Credenciales incompletas");
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user || user.role !== "ADMIN") {
        throw new Error("Credenciales inválidas o sin permisos de administrador");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        throw new Error("Credenciales inválidas");
    }

    await createSession({
        userId: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
    });

    redirect("/admin");
}
export async function logoutAdmin() {
    await deleteSession("ADMIN");
    redirect("/admin/login");
}
