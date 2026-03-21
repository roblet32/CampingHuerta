import Link from "next/link";
import AnimatedSection from "@/components/public/AnimatedSection";

export const dynamic = 'force-dynamic';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 font-[family-name:var(--font-geist-sans)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                        Sobre Nosotros
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                        Nuestra historia, nuestra pasión y por qué decidimos compartir este rincón de naturaleza contigo.
                    </p>
                </AnimatedSection>

                {/* Story Section 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                    <AnimatedSection animation="slide-left" className="order-2 lg:order-1 relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-xl">
                        <div className="absolute inset-0 bg-[url('/images/gallery/3.jpeg')] bg-cover bg-center" />
                    </AnimatedSection>
                    <AnimatedSection animation="slide-right" delay={100} className="order-1 lg:order-2 space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">Nuestros Inicios</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            CampingHuerta nació de un sueño familiar: crear un refugio donde las personas pudieran desconectarse del ajetreo de la ciudad y reconectar con lo verdaderamente importante: la naturaleza, la familia y uno mismo.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Lo que empezó como un pequeño terreno para reuniones dominicales, rápidamente se transformó al ver la paz que nuestros amigos y visitantes encontraban entre estos árboles centenarios y el sonido del río cercano.
                        </p>
                    </AnimatedSection>
                </div>

                {/* Story Section 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                    <AnimatedSection animation="slide-left" delay={100} className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">Nuestra Filosofía</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Creemos firmemente en el turismo sustentable y el respeto absoluto por nuestro entorno. Cada espacio ha sido diseñado para integrarse armónicamente con el paisaje, asegurando que nuestra huella sea mínima.
                        </p>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Ya sea que vengas con tu casa rodante, tu tienda de campaña o busques la comodidad de nuestras cabañas, queremos que te sientas como en casa pero con la magia del bosque como telón de fondo.
                        </p>
                    </AnimatedSection>
                    <AnimatedSection animation="slide-right" className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-xl">
                        <div className="absolute inset-0 bg-[url('/images/gallery/5.jpeg')] bg-cover bg-center" />
                    </AnimatedSection>
                </div>

                {/* Call to Action */}
                <AnimatedSection animation="fade-up">
                    <div className="bg-emerald-800 rounded-3xl p-8 md:p-16 text-center shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-emerald-700/50 blur-3xl z-0"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-emerald-900/50 blur-3xl z-0"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Listo para vivir la experiencia?</h2>
                            <p className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto">
                                Ven y forma parte de nuestra historia. Te aseguramos que tu primera visita no será la última.
                            </p>
                            <Link href="/espacios" className="inline-flex justify-center items-center gap-2 py-4 px-10 bg-white hover:bg-emerald-50 text-emerald-800 font-bold rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                                Conoce Nuestros Espacios
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                            </Link>
                        </div>
                    </div>
                </AnimatedSection>

            </div>
        </div>
    );
}
