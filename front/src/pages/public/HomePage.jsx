import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import SolutionDetailModal from '../../components/ui/SolutionDetailModal'
import { featuredProducts } from '../../data/mockData'

export default function HomePage() {
    const [selectedSolution, setSelectedSolution] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)

    const solutions = [
        { id: 'corporativo', title: 'Poleras y Camisas', category: 'LÍNEA CORPORATIVA', badge: 'MÁS VENDIDO', badgeColor: 'bg-secondary-container', price: 'Desde $12.900 CLP', description: 'Prendas profesionales para imagen corporativa. Bordado personalizado incluido.', image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=400&fit=crop' },
        { id: 'industrial', title: 'Ropa de Trabajo', category: 'LÍNEA INDUSTRIAL', badge: 'DURADERO', badgeColor: 'bg-primary', price: 'Desde $28.900 CLP', description: 'Pantalones cargo, chalecos geólogo y prendas resistentes para terreno.', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop' },
        { id: 'bordado', title: 'Bordado de Logo', category: 'PERSONALIZACIÓN', badge: 'BORDADO INCLUIDO', badgeColor: 'bg-secondary-container', price: 'Desde $10.000 CLP', description: 'Bordado profesional de alta calidad en todas tus prendas corporativas.', image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=400&fit=crop' },
        { id: 'equipos', title: 'Desde 10 Prendas', category: 'EQUIPOS PEQUEÑOS', badge: 'FLEXIBLE', badgeColor: 'bg-primary', price: 'Precios B2B', description: 'Soluciones flexibles combinando diferentes prendas, tallas y colores.', image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop' }
    ]

    const handleViewDetails = (solution) => {
        setSelectedSolution(solution)
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
        setSelectedSolution(null)
    }

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://www.eldescuevee.cl/categoria-bordado.jpg"
                        alt="Ropa corporativa bordada"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40"></div>
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
                        <div className="flex gap-4 flex-wrap">
                            <Link
                                to="/catalogo"
                                className="bg-[#FC9430] text-white px-8 py-4 font-bold uppercase tracking-wider hover:brightness-110 transition-all active:scale-95"
                            >
                                Cotizar desde 10 prendas
                            </Link>
                            <a
                                href="https://wa.me/56912345678?text=Hola,%20quisiera%20cotizar%20prendas%20corporativas"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border-2 border-white text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-white/10 transition-all active:scale-95"
                            >
                                Contacto directo
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Bar con componente Icon */}
            <section className="bg-surface-container-low py-12 border-b border-outline-variant">
                <div className="max-w-[1280px] mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: 'verified', title: 'Calidad Garantizada', desc: 'Prendas y bordados que mantienen presentación en el tiempo' },
                        { icon: 'bolt', title: 'Respuesta Ágil', desc: 'Cotizaciones rápidas, claras y sin rodeos' },
                        { icon: 'handshake', title: 'Trato Directo', desc: 'Hablamos cercano para orientarte mejor' }
                    ].map((item) => (
                        <div key={item.title} className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-16 h-16 bg-primary flex items-center justify-center text-white group-hover:bg-[#FC9430] transition-colors">
                                <Icon name={item.icon} className="text-4xl" fill={false} weight={400} />
                            </div>
                            <div>
                                <h4 className="font-bold uppercase text-primary group-hover:text-[#FC9430] transition-colors">{item.title}</h4>
                                <p className="text-sm text-on-surface-variant">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Sección Nuestras Soluciones */}
            <div className="max-w-[1280px] mx-auto px-8 py-16">
                <div className="flex justify-between items-end mb-8 border-b-2 border-primary-container pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-primary uppercase">Nuestras Soluciones</h2>
                        <p className="text-on-surface-variant text-sm mt-1">Líneas especializadas para cada necesidad</p>
                    </div>
                    <Link to="/catalogo" className="text-[#FC9430] font-bold uppercase hover:underline flex items-center gap-1">
                        Ver todas
                        <Icon name="arrow_forward" className="text-sm" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {solutions.map((solution) => (
                        <div key={solution.id} className="bg-white border border-outline-variant group hover:border-primary transition-all duration-300 flex flex-col relative">
                            <div className="absolute top-4 left-4 z-10">
                                <span className={`${solution.badgeColor} text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter`}>
                                    {solution.badge}
                                </span>
                            </div>
                            <div className="aspect-square overflow-hidden bg-surface-container-low p-8">
                                <img
                                    alt={solution.title}
                                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                    src={solution.image}
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <p className="text-label-sm text-on-surface-variant mb-1 uppercase">{solution.category}</p>
                                <h3 className="font-h3 text-lg text-primary mb-2 group-hover:text-secondary transition-colors uppercase">
                                    {solution.title}
                                </h3>
                                <p className="text-xs text-on-surface-variant mb-4">
                                    {solution.description}
                                </p>
                                <div className="mt-auto flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-h3 text-[#FC9430] font-black">{solution.price}</span>
                                        <span className="text-[10px] text-on-surface-variant">Pedido mínimo 10 unidades</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-on-surface uppercase border-b border-primary">
                                        VER MÁS
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 pt-0 grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleViewDetails(solution)}
                                    className="bg-white border-2 border-primary text-primary py-2 text-xs font-bold uppercase hover:bg-surface-container transition-colors rounded"
                                >
                                    Ver Detalles
                                </button>
                                <button className="bg-secondary-container text-on-secondary-container py-2 text-xs font-bold uppercase hover:bg-[#e0852b] transition-colors rounded">
                                    Cotizar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Prendas Destacadas */}
            <div className="max-w-[1280px] mx-auto px-8 pb-16">
                <div className="flex justify-between items-end mb-8 border-b-2 border-primary-container pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-primary uppercase">Prendas Destacadas</h2>
                        <p className="text-on-surface-variant text-sm mt-1">Las más solicitadas por nuestros clientes</p>
                    </div>
                    <Link to="/catalogo" className="text-[#FC9430] font-bold uppercase hover:underline flex items-center gap-1">
                        Ver todas
                        <Icon name="arrow_forward" className="text-sm" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredProducts.map(product => (
                        <div key={product.id} className="bg-white border border-outline-variant group hover:border-primary transition-all duration-300 flex flex-col relative">
                            <div className="absolute top-4 left-4 z-10">
                                <span className="bg-primary text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter">
                                    DISPONIBLE
                                </span>
                            </div>
                            <div className="aspect-square overflow-hidden bg-surface-container-low p-8">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="font-h3 text-lg text-primary mb-2 group-hover:text-secondary transition-colors uppercase">
                                    {product.name}
                                </h3>
                                <p className="text-xs text-on-surface-variant mb-4 line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="mt-auto flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-h3 text-[#FC9430] font-black">${product.price.toLocaleString()} CLP</span>
                                    </div>
                                    <button className="w-10 h-10 bg-[#FC9430] text-white flex items-center justify-center hover:brightness-110 transition-colors rounded-full">
                                        <Icon name="shopping_cart" className="text-sm" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal de detalles */}
            <SolutionDetailModal
                isOpen={modalOpen}
                onClose={handleCloseModal}
                solution={selectedSolution}
            />
        </div>
    )
}