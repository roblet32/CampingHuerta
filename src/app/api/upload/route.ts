import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/session";

// Ensure uploads directory exists and save the file
export async function POST(request: NextRequest) {
    try {
        const session = await getSession("ADMIN");
        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "No autorizado. Se requiere sesión de administrador." }, { status: 401 });
        }

        const formData = await request.formData();

        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Tipo de archivo no permitido. Solo JPEG, PNG, WebP o GIF." }, { status: 400 });
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "El archivo es demasiado grande. Máximo 5MB." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate a unique filename to avoid collisions
        const timestamp = Date.now();
        const safeOriginalName = file.name.replace(/[^a-zA-Z0-9.]/g, "_").slice(0, 40);
        const filename = `${timestamp}_${safeOriginalName}`;

        // Destination: public/uploads/spaces/
        const uploadDir = path.join(process.cwd(), "public", "uploads", "spaces");
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // Return the public URL path
        const publicPath = `/uploads/spaces/${filename}`;
        return NextResponse.json({ url: publicPath }, { status: 200 });

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Error interno al subir el archivo." }, { status: 500 });
    }
}
