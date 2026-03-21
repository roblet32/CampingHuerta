import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AnimatedSection from "@/components/public/AnimatedSection";

export const dynamic = 'force-dynamic';

const typeLabels: Record<string, string> = {
    PARKING: "Estacionamiento",
    OPEN_FIELD: "Campo Abierto",
    PALAPA: "Palapa",
    RIVERSIDE: "Cerca del Río",
    HOUSE: "Casa / Cabaña"
};

function TypeIcon({ type }: { type: string }) {
    const cls = "w-4 h-4";
    switch (type) {
        case "PARKING":
            return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V8h4a3 3 0 110 6H9" /></svg>;
        case "OPEN_FIELD":
            return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" strokeWidth={2}/></svg>;
        case "PALAPA":
            return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" /></svg>;
        case "RIVERSIDE":
            return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19a9 9 0 019 0 9 9 0 019 0M3 6a9 9 0 019 0 9 9 0 019 0M3 6v13M21 6v13" /></svg>;
        case "HOUSE":
            return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
        default:
            return <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>;
    }
}

export default async function PublicSpacesPage() {
    const spaces = await prisma.space.findMany({
        where: { isAvailable: true },
        orderBy: { price: 'asc' }
    });

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 font-[family-name:var(--font-geist-sans)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <AnimatedSection animation="fade-up" className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Nuestros <span className="text-emerald-600">Espacios</span>
                    </h1>
                    <p className="text-lg text-gray-600">
                        Explora las diferentes opciones que tenemos para hacer de tu estadía una experiencia inolvidable.
                    </p>
                </AnimatedSection>

                {spaces.length === 0 ? (
                    <AnimatedSection animation="fade-in" className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-gray-500 font-medium">Aún no hay espacios disponibles.</p>
                    </AnimatedSection>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {spaces.map((space, index) => (
                            <AnimatedSection key={space.id} animation="fade-up" delay={index * 80}>
                                <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full">

                                    {/* Image Wrapper */}
                                    <div className="h-56 relative overflow-hidden bg-gray-100">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                            style={{ backgroundImage: `url('${space.images?.[0] || '/images/gallery/1.jpeg'}')` }}
                                        />
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            <span className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 flex items-center gap-1.5 shadow-sm">
                                                <TypeIcon type={space.type} />
                                                {typeLabels[space.type] || space.type}
                                            </span>
                                        </div>
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-emerald-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-sm">
                                                ${space.price.toFixed(2)} <span className="text-emerald-200 text-xs font-normal">/noche</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 md:p-8 flex flex-col flex-grow">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{space.name}</h3>
                                        <p className="text-gray-600 line-clamp-3 mb-6 flex-grow">{space.description}</p>

                                        <div className="border-t border-gray-100 pt-6 mt-auto">
                                            <div className="flex justify-between items-center mb-6">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Capacidad</span>
                                                    <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                                                        <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                        Hasta {space.capacity} personas
                                                    </span>
                                                </div>
                                            </div>

                                            <Link
                                                href={`/espacios/${space.id}`}
                                                className="w-full inline-flex justify-center items-center gap-2 py-3.5 px-4 bg-gray-900 hover:bg-emerald-600 text-white font-medium rounded-xl transition-colors shadow-sm"
                                            >
                                                Reservar Este Espacio
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
