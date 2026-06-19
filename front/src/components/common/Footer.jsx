export default function Footer() {
    return (
        <footer className="bg-slate-100 border-t-8 border-[#163C7A] mt-12">
            <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 py-12 px-8">
                <div>
                    <div className="text-xl font-black text-[#163C7A] uppercase mb-4">EL DESCUEVEE</div>
                    <p className="text-xs font-semibold text-slate-500">
                        Ropa corporativa y bordado profesional. Potenciamos la imagen de tu equipo con prendas que duran.
                    </p>
                    <p className="mt-4 text-xs text-slate-500">Desde La Serena hasta Calbuco</p>
                </div>

                <div>
                    <h4 className="text-sm font-bold uppercase text-[#163C7A] mb-6">Recursos</h4>
                    <div className="flex flex-col gap-3">
                        <a href="/catalogo" className="text-xs font-semibold text-slate-500 hover:text-[#FC9430]">Catálogo de prendas</a>
                        <a href="#" className="text-xs font-semibold text-slate-500 hover:text-[#FC9430]">Guía de tallas</a>
                        <a href="#" className="text-xs font-semibold text-slate-500 hover:text-[#FC9430]">Políticas de devolución</a>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-bold uppercase text-[#163C7A] mb-6">Soporte</h4>
                    <div className="flex flex-col gap-3">
                        <a href="#" className="text-xs font-semibold text-slate-500 hover:text-[#FC9430]">Cotización B2B</a>
                        <a href="https://wa.me/56912345678" className="text-xs font-semibold text-slate-500 hover:text-[#FC9430]">Atención directa WhatsApp</a>
                        <a href="mailto:contacto@eldescuevee.cl" className="text-xs font-semibold text-slate-500 hover:text-[#FC9430]">contacto@eldescuevee.cl</a>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-bold uppercase text-[#163C7A] mb-6">Newsletter</h4>
                    <div className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Correo corporativo"
                            className="w-full bg-white border border-slate-300 px-4 py-2 text-xs focus:ring-1 focus:ring-primary outline-none"
                        />
                        <button className="bg-[#163C7A] text-white py-2 text-xs font-bold uppercase tracking-widest hover:bg-[#FC9430] transition-colors">
                            Suscribirse
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1280px] mx-auto px-8 py-8 border-t border-slate-200 text-center">
                <p className="text-xs font-semibold text-slate-400">
                    © 2025 El Descuevee - Ropa Corporativa y Bordado Profesional. Atención desde La Serena hasta Calbuco.
                </p>
            </div>
        </footer>
    )
}