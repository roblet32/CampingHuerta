import { prisma } from "@/lib/prisma";
import AdminCreationForm from "./AdminCreationForm";

export default async function AdminConfiguracionPage() {
    const admins = await prisma.user.findMany({
        where: { role: "ADMIN" },
        select: { id: true, name: true, email: true, createdAt: true },
        orderBy: { createdAt: "asc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Cuentas Administrativas</h1>
                    <p className="text-sm text-slate-500 mt-1">Gestiona los accesos al panel de CampingHuerta.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Current Admins List */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="text-lg font-bold text-slate-800">Administradores Activos</h3>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-4">
                            {admins.map((admin) => (
                                <li key={admin.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg uppercase">
                                            {admin.name?.charAt(0) || "A"}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">{admin.name}</p>
                                            <p className="text-sm text-slate-500">{admin.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs text-slate-400">
                                        Creado el {admin.createdAt.toLocaleDateString()}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Create New Admin Form */}
                <div className="lg:col-span-1">
                    <AdminCreationForm />
                </div>
            </div>
        </div>
    );
}
