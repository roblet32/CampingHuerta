import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import BookingWidget from "./BookingWidget";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

const typeLabels: Record<string, string> = {
    PARKING: "Estacionamiento",
    OPEN_FIELD: "Campo Abierto",
    PALAPA: "Palapa",
    RIVERSIDE: "Cerca del Río",
    HOUSE: "Casa"
};

// SVG icon for each amenity
function AmenityIcon({ name }: { name: string }) {
    const cls = "w-5 h-5 text-emerald-600";
    switch (name) {
        case "fire":
            return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>;
        case "shower":
            return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
        case "tree":
            return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
        case "shield":
            return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
        default:
            return null;
    }
}

export default async function SpaceDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    const space = await prisma.space.findUnique({
        where: { id }
    });

    if (!space) {
        notFound();
    }

    const session = await getSession("USER");
    const typeLabel = typeLabels[space.type] || "Espacio";

    // Pick a local fallback image based on space type if no images set
    const typeFallbacks: Record<string, string> = {
        PARKING: "/images/gallery/centro.jpeg",
        OPEN_FIELD: "/images/gallery/klalalala.jpeg",
        PALAPA: "/images/gallery/tyq.jpeg",
        RIVERSIDE: "/images/gallery/orilla1.jpeg",
        HOUSE: "/images/gallery/hjjdlala.jpeg",
    };
    const heroImage = space.images?.[0] || typeFallbacks[space.type] || "/images/gallery/1.jpeg";

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Back button */}
                <div className="mb-6">
                    <Link href="/espacios" className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-2 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Volver a Espacios
                    </Link>
                </div>

                {/* Hero Image */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 mb-10 h-[50vh] min-h-[400px] relative">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${heroImage}')` }}
                    />
                    {!space.isAvailable && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-white/90 text-red-700 font-bold text-xl px-6 py-3 rounded-full">
                                No Disponible
                            </span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Main Content (Left) */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {typeLabel}
                                </span>
                                <span className="flex items-center gap-1.5 text-slate-600 text-sm font-medium">
                                    <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Hasta {space.capacity} {space.capacity === 1 ? 'persona' : 'personas'}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                                {space.name}
                            </h1>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {space.description || "Un lugar perfecto para desconectar y disfrutar de la naturaleza en su máxima expresión."}
                            </p>
                        </div>

                        {/* Features / Amenities */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">¿Qué ofrece este espacio?</h3>
                            <div className="grid grid-cols-2 gap-4 text-slate-700">
                                <div className="flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                        <AmenityIcon name="fire" />
                                    </span>
                                    <span>Área de Fogata</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                        <AmenityIcon name="shower" />
                                    </span>
                                    <span>Baños Cercanos</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                        <AmenityIcon name="tree" />
                                    </span>
                                    <span>Sombra Natural</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                        <AmenityIcon name="shield" />
                                    </span>
                                    <span>Seguridad 24/7</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Widget (Right) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <BookingWidget
                                spaceId={space.id}
                                spaceName={space.name}
                                price={space.price}
                                capacity={space.capacity}
                                isAvailable={space.isAvailable}
                                isLoggedIn={!!session}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
