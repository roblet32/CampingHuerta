export default function Footer() {
    return (
        <footer className="bg-slate-900 py-12 text-slate-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                        C
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight">CampingHuerta</span>
                </div>
                <p className="text-sm">© {new Date().getFullYear()} CampingHuerta. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
}
