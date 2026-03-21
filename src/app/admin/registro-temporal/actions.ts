"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession } from "@/lib/session";

export async function registerAdmin(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password || !name) {
        throw new Error("Missing required fields");
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("El correo ya está registrado");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    // Automatically log them in by creating a session
    await createSession({
        userId: user.id,
        role: user.role,
        email: user.email,
        name: user.name,
    });

    redirect("/admin");
}
