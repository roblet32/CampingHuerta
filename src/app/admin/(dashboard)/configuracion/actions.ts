"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";

export async function createInternalAdmin(formData: FormData) {
    const session = await getSession("ADMIN");

    if (!session || session.role !== "ADMIN") {
        throw new Error("No autorizado. Se requiere sesión de administrador.");
    }

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password || !name) {
        throw new Error("Missing required fields");
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("El correo ya está registrado");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    revalidatePath("/admin/configuracion");
}
