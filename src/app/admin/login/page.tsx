import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminLoginForm from "./AdminLoginForm";

export default async function AdminLoginPage() {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount === 0) {
        redirect("/admin/registro-temporal");
    }
    return <AdminLoginForm />;
}
