import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminRegistrationForm from "./AdminRegistrationForm";

export default async function AdminRegistrationPage() {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount > 0) {
        redirect("/admin/login");
    }
    return <AdminRegistrationForm />;
}
