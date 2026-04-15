import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { logoutClient } from "@/app/(public)/login/actions";
import Link from "next/link";
import PaymentInstructionsModal from "./PaymentSelectionModal";
import { getStayStatus } from "@/lib/stay-utils";

export default async function PerfilPage() {
    const session = await getSession("USER");

    if (!session) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
            reservations: {
                orderBy: { startDate: "desc" },
                include: { space: true }
            }
        }
    });

    if (!user) {
        // Fallback in case user was deleted
        redirect("/login");
    }


    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Profile Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="bg-emerald-600 h-32 w-full"></div>
                    <div className="px-8 pb-8 flex flex-col sm:flex-row items-center sm:items-end sm:justify-between -mt-12 gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-700 uppercase shadow-md">
                                {user.name ? user.name.charAt(0) : "U"}
                            </div>
                            <div className="text-center sm:text-left mt-4 sm:mt-12">
                                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                                <p className="text-slate-500">{user.email}</p>
                            </div>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <form action={logoutClient}>
                                <button type="submit" className="px-6 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-xl transition-colors border border-red-100 shadow-sm">
                                    Cerrar Sesión
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Reservations Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <span>📅</span> Mi Historial de Reservas
                        </h2>
                        <Link href="/espacios" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                            + Nueva Reserva
                        </Link>
                    </div>

                    <div className="p-8">
                        {user.reservations.length === 0 ? (
                            <div className="text-center py-12">
                                <span className="text-4xl">⛺</span>
                                <h3 className="text-lg font-medium text-slate-900 mt-4">Aún no tienes reservaciones</h3>
                                <p className="text-slate-500 mt-2">Explora nuestros espacios y planea tu próxima escapada a la naturaleza.</p>
                                <Link href="/espacios" className="inline-block mt-6 px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors">
                                    Ver Espacios
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {user.reservations.map((reservation) => (
                                    <div key={reservation.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors gap-4">
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                                {/* Imagen placeholder si no hay imagen real */}
                                                <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-2xl">
                                                    🌲
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-900 text-lg">{reservation.space.name}</h4>
                                                <p className="text-sm text-slate-500">
                                                    Del {reservation.startDate.toLocaleDateString()} al {reservation.endDate.toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-auto mt-2 md:mt-0 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                                            {(() => {
                                                const stay = getStayStatus(reservation.startDate, reservation.endDate, reservation.status);
                                                return (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${stay.color}`}>
                                                        {stay.label}
                                                    </span>
                                                );
                                            })()}

                                            {/* We approximate price calculation for now just using the space price * guests * nights as a demo,
                                                ideal reality would have saved total price in DB. */}
                                            {(() => {
                                                if (!reservation.space || !reservation.startDate || !reservation.endDate) return null;
                                                
                                                try {
                                                    const start = new Date(reservation.startDate);
                                                    const end = new Date(reservation.endDate);
                                                    const diff = Math.abs(end.getTime() - start.getTime());
                                                    const nights = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
                                                    const total = (reservation.space.price || 0) * nights;

                                                    return (
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-sm font-bold text-slate-700">
                                                                Total Estimado: ${total}
                                                            </span>
                                                            {reservation.status === 'APPROVED' && (
                                                                <PaymentInstructionsModal reservationId={reservation.id} totalPrice={total} />
                                                            )}
                                                        </div>
                                                    );
                                                } catch (e) {
                                                    console.error("Error calculating total for reservation:", reservation.id, e);
                                                    return null;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
