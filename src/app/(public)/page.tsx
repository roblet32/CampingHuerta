import Link from "next/link";
import AnimatedSection from "@/components/public/AnimatedSection";

export default function Home() {
    return (
        <div className="min-h-screen bg-slate-50 font-[family-name:var(--font-geist-sans)]">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-emerald-900/20 to-slate-50 z-10" />
                    <div className="absolute inset-0 bg-[url('/images/gallery/1.jpeg')] bg-cover bg-center" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <AnimatedSection animation="fade-up">
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-md">
                            Desconecta en la <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-100">Naturaleza</span>
                        </h1>
                        <p className="mt-4 text-xl md:text-2xl font-light max-w-2xl mx-auto text-emerald-50 drop-shadow">
                            Reserva tu espacio ideal en nuestro camping y vive una experiencia inolvidable.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href="/espacios" className="px-8 py-4 rounded-full bg-emerald-600 text-white font-semibold text-lg hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0">
                                Explorar Espacios
                            </Link>
                            <Link href="/nosotros" className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md text-white font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all">
                                Más Información
                            </Link>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* Features/Spaces Preview */}
            <section id="espacios" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection animation="fade-up" className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nuestros Espacios</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Lugares diseñados para tu comodidad, rodeados de naturaleza pura.</p>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <AnimatedSection animation="fade-up" delay={0}>
                            <div className="group rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block">
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('/images/gallery/2.jpeg')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-emerald-700">
                                        Desde $25/noche
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Zona Carpas Familiar</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">Espacios amplios bajo la sombra de pinos centenarios, ideal para familias con niños.</p>
                                    <div className="flex gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            6 personas max
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                            Electricidad
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Card 2 */}
                        <AnimatedSection animation="fade-up" delay={100}>
                            <div className="group rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block">
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('/images/gallery/4.jpeg')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-emerald-700">
                                        Desde $40/noche
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Sitio Premium RV</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">Sitios con acceso fácil para casas rodantes y servicios completos de agua y electricidad.</p>
                                    <div className="flex gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                                            RV / Motorhome
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19a9 9 0 0 1 9 0 9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0 9 9 0 0 1 9 0M3 6v13M21 6v13" /></svg>
                                            Agua incluida
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Card 3 */}
                        <AnimatedSection animation="fade-up" delay={200}>
                            <div className="group rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block">
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('/images/gallery/orilla1.jpeg')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-emerald-700">
                                        Desde $15/noche
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Área Mochileros</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">Parcelas pequeñas e íntimas cerca del arroyo para los que buscan máxima desconexión.</p>
                                    <div className="flex gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                            2 personas max
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                                            Próximo al bosque
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>

                    <AnimatedSection animation="fade-up" delay={100} className="mt-12 text-center">
                        <Link href="/espacios" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-slate-200 text-gray-700 font-semibold hover:border-emerald-600 hover:text-emerald-700 transition-colors">
                            Ver Todos Los Espacios
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                    </AnimatedSection>
                </div>
            </section>

        </div>
    );
}
