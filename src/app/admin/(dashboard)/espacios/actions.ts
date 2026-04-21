"use server";

import { prisma } from "@/lib/prisma";
import { SpaceType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";


export async function createSpace(formData: FormData) {
    const session = await getSession("ADMIN");
    if (!session || session.role !== "ADMIN") {
        throw new Error("No autorizado. Se requiere sesión de administrador.");
    }

    const name = formData.get("name") as string;

    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const capacity = parseInt(formData.get("capacity") as string, 10);
    const type = formData.get("type") as SpaceType;
    const isAvailable = formData.get("isAvailable") === "on";

    // Handling images: For now, assuming comma-separated URLs from a text input
    // In a real app, this would integrate with an image upload service like AWS S3 or uploadthing
    const imagesString = formData.get("images") as string;
    const images = imagesString ? imagesString.split(",").map(url => url.trim()).filter(Boolean) : [];

    await prisma.space.create({
        data: {
            name,
            description,
            price,
            capacity,
            type,
            isAvailable,
            images,
        },
    });

    revalidatePath("/admin/espacios");
    revalidatePath("/espacios");
    redirect("/admin/espacios");
}

export async function updateSpace(id: string, formData: FormData) {
    const session = await getSession("ADMIN");
    if (!session || session.role !== "ADMIN") {
        throw new Error("No autorizado. Se requiere sesión de administrador.");
    }

    const name = formData.get("name") as string;

    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const capacity = parseInt(formData.get("capacity") as string, 10);
    const type = formData.get("type") as SpaceType;
    const isAvailable = formData.get("isAvailable") === "on";

    const imagesString = formData.get("images") as string;
    const images = imagesString ? imagesString.split(",").map(url => url.trim()).filter(Boolean) : [];

    await prisma.space.update({
        where: { id },
        data: {
            name,
            description,
            price,
            capacity,
            type,
            isAvailable,
            images,
        },
    });

    revalidatePath("/admin/espacios");
    revalidatePath("/espacios");
    redirect("/admin/espacios");
}

export async function deleteSpace(id: string) {
    const session = await getSession("ADMIN");
    if (!session || session.role !== "ADMIN") {
        throw new Error("No autorizado. Se requiere sesión de administrador.");
    }

    await prisma.space.delete({

        where: { id },
    });

    revalidatePath("/admin/espacios");
    revalidatePath("/espacios");
}
