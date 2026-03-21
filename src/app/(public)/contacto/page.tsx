import AnimatedSection from "@/components/public/AnimatedSection";

export const dynamic = 'force-dynamic';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 font-[family-name:var(--font-geist-sans)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <AnimatedSection animation="fade-up" className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Contáctanos
                    </h1>
                    <p className="text-lg text-gray-600">
                        ¿Tienes alguna duda o solicitud especial? Estamos aquí para ayudarte a planear tu escapada perfecta.
                    </p>
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={80}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                        {/* Contact Information */}
                        <div className="bg-emerald-800 p-8 md:p-12 text-emerald-50 relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-emerald-700/50 blur-3xl z-0"></div>
                            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-emerald-900/50 blur-3xl z-0"></div>

                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold mb-8 font-[family-name:var(--font-geist-sans)]">Información de Contacto</h2>
                                <ul className="space-y-8">
                                    <li className="flex items-start gap-4">
                                        <span className="w-10 h-10 rounded-full bg-emerald-700/50 flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </span>
                                        <div>
                                            <h3 className="font-semibold text-lg text-emerald-200">Visítanos</h3>
                                            <p className="text-emerald-50 mt-1 leading-relaxed">
                                                Carretera Principal km 45, <br />
                                                Valle de la Naturaleza, <br />
                                                Código Postal: 12345
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="w-10 h-10 rounded-full bg-emerald-700/50 flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </span>
                                        <div>
                                            <h3 className="font-semibold text-lg text-emerald-200">Llámanos</h3>
                                            <p className="text-emerald-50 mt-1">
                                                +52 123 456 7890 <br />
                                                +52 098 765 4321
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <span className="w-10 h-10 rounded-full bg-emerald-700/50 flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg className="w-5 h-5 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </span>
                                        <div>
                                            <h3 className="font-semibold text-lg text-emerald-200">Escríbenos</h3>
                                            <p className="text-emerald-50 mt-1">
                                                contacto@campinghuerta.com <br />
                                                reservas@campinghuerta.com
                                            </p>
                                        </div>
                                    </li>
                                </ul>

                                <div className="mt-12">
                                    <h3 className="font-semibold mb-4 text-emerald-200">Síguenos en Redes</h3>
                                    <div className="flex gap-4">
                                        {/* Facebook */}
                                        <div className="w-10 h-10 rounded-full bg-emerald-700/50 flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                            </svg>
                                        </div>
                                        {/* Instagram */}
                                        <div className="w-10 h-10 rounded-full bg-emerald-700/50 flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">
                                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                        {/* WhatsApp */}
                                        <div className="w-10 h-10 rounded-full bg-emerald-700/50 flex items-center justify-center hover:bg-emerald-600 transition-colors cursor-pointer">
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-[family-name:var(--font-geist-sans)]">Envíanos un Mensaje</h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">Nombre</label>
                                        <input type="text" id="firstName" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 focus:bg-white outline-none transition-all text-gray-800" placeholder="Ej: Carlos" />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">Apellidos</label>
                                        <input type="text" id="lastName" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 focus:bg-white outline-none transition-all text-gray-800" placeholder="Ej: Ramírez" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico</label>
                                    <input type="email" id="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 focus:bg-white outline-none transition-all text-gray-800" placeholder="ejemplo@correo.com" />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">Asunto</label>
                                    <input type="text" id="subject" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 focus:bg-white outline-none transition-all text-gray-800" placeholder="Ej: Precios para grupos grandes..." />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">Mensaje</label>
                                    <textarea id="message" rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 focus:bg-white outline-none transition-all text-gray-800 resize-none" placeholder="Escribe aquí tus dudas o comentarios..."></textarea>
                                </div>

                                <div className="pt-2">
                                    <button type="button" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-sm active:scale-[0.98]">
                                        Enviar Mensaje
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </AnimatedSection>

                {/* Map Placeholder */}
                <AnimatedSection animation="fade-up" delay={100} className="mt-12 bg-white p-2 rounded-3xl border border-gray-100 shadow-sm h-96 relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-[url('/images/gallery/centro.jpeg')] bg-cover bg-center opacity-50" />
                    <div className="relative z-10 bg-white/90 backdrop-blur-sm px-6 py-4 rounded-xl border border-gray-200 shadow-lg text-center">
                        <span className="text-gray-800 font-semibold flex items-center gap-2">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Mapa en construcción
                        </span>
                    </div>
                </AnimatedSection>

            </div>
        </div>
    );
}
