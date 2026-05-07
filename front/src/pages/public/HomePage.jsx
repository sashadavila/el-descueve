import { Link } from 'react-router-dom'
import ProductCard from '../../components/ui/ProductCard'
import { featuredProducts, categories } from '../../data/mockData'

export default function HomePage() {
    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary/90 to-primary/40">
                    <img
                        src="https://www.eldescuevee.cl/categoria-bordado.jpg"
                        alt="Ropa corporativa bordada"
                        className="w-full h-full object-cover mix-blend-overlay"
                    />
                </div>
                <div className="relative z-10 max-w-[1280px] mx-auto px-8 w-full">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">
                            POTENCIAMOS LA IMAGEN DE TU EQUIPO CON PRENDAS BORDADAS QUE DURAN
                        </h1>
                        <p className="text-lg text-slate-100 mb-10 border-l-4 border-[#FC9430] pl-6">
                            Poleras, micropolar, jeans, cargo y chalecos geólogo para empresas y equipos de trabajo.
                            Atención directa, cotización ágil y foco en una presentación profesional.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                to="/catalogo"
                                className="bg-[#FC9430] text-white px-8 py-4 font-bold uppercase tracking-wider hover:brightness-110 transition-all"
                            >
                                Cotizar desde 10 prendas
                            </Link>
                            <a
                                href="https://wa.me/56912345678"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border-2 border-white text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-white/10 transition-all"
                            >
                                Contacto directo
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Bar */}
            <section className="bg-surface-container-low py-12 border-b border-outline-variant">
                <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: 'verified', title: 'Calidad Garantizada', desc: 'Prendas y bordados que mantienen presentación en el tiempo' },
                        { icon: 'bolt', title: 'Respuesta Ágil', desc: 'Cotizaciones rápidas, claras y sin rodeos' },
                        { icon: 'handshake', title: 'Trato Directo', desc: 'Hablamos cercano para orientarte mejor' }
                    ].map(item => (
                        <div key={item.title} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-primary flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-4xl">{item.icon}</span>
                            </div>
                            <div>
                                <h4 className="font-bold uppercase text-primary">{item.title}</h4>
                                <p className="text-sm text-on-surface-variant">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <div className="max-w-[1280px] mx-auto px-8 py-12">
                <div className="flex justify-between items-end mb-8 border-b-2 border-primary-container pb-4">
                    <h2 className="text-2xl font-bold text-primary uppercase">Prendas Destacadas</h2>
                    <Link to="/catalogo" className="text-[#FC9430] font-bold uppercase hover:underline">Ver todas</Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}