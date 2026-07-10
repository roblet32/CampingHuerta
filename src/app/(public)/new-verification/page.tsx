import Link from "next/link";
import { newVerification } from "./actions";

type NewVerificationPageProps = {
    searchParams: Promise<{
        token?: string;
    }>;
};

export default async function NewVerificationPage({ searchParams }: NewVerificationPageProps) {
    const { token } = await searchParams;
    const result = token
        ? await newVerification(token)
        : { error: "¡Falta el token!", success: undefined };

    const success = result.success;
    const error = result.error;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-24 font-[family-name:var(--font-geist-sans)]">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Verificación de Correo</h1>

                {success && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-emerald-600 font-medium mb-8">{success}</p>
                        <Link href="/login" className="w-full bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-700 transition-all">
                            Iniciar Sesión
                        </Link>
                    </div>
                )}

                {error && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <p className="text-red-600 font-medium mb-8">{error}</p>
                        <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                            Volver al inicio de sesión
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
