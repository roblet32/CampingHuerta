import Link from "next/link";
import ImageCarousel from "@/components/public/ImageCarousel";
import AnimatedSection from "@/components/public/AnimatedSection";

export const dynamic = 'force-dynamic';

const galleryImages = [
    { id: 1, src: "images/gallery/1.jpeg", alt: "Vista del camping al atardecer" },
    { id: 2, src: "images/gallery/2.jpeg", alt: "Fogata familiar" },
    { id: 3, src: "images/gallery/3.jpeg", alt: "Espacio para casas rodantes" },
    { id: 4, src: "images/gallery/4.jpeg", alt: "Río y naturaleza" },
    { id: 5, src: "images/gallery/5.jpeg", alt: "Actividades al aire libre" },
    { id: 6, src: "images/gallery/6.jpeg", alt: "Noche estrellada en el camping" },
];

export default function GalleryPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 font-[family-name:var(--font-geist-sans)]">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                <AnimatedSection animation="fade-up" className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        Nuestra <span className="text-emerald-600">Galería</span>
                    </h1>
                    <p className="text-lg text-gray-600">
                        Descubre la belleza de la naturaleza y las instalaciones que te esperan en CampingHuerta.
                    </p>
                </AnimatedSection>

                <AnimatedSection animation="fade-in" delay={100}>
                    <ImageCarousel images={galleryImages} autoPlay={true} interval={5000} />
                </AnimatedSection>

                <AnimatedSection animation="fade-up" delay={150} className="mt-16 text-center">
                    <Link href="/espacios" className="inline-flex justify-center items-center py-4 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                        Ver Nuestros Espacios
                    </Link>
                </AnimatedSection>

            </div>
        </div>
    );
}
