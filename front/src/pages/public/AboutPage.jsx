import { Link } from 'react-router-dom'
import Icon from '../../components/ui/Icon'

export default function AboutPage() {
    // Datos de la empresa
    const companyInfo = {
        foundingYear: 2015,
        employees: 45,
        customers: 500,
        productsSold: 150000,
        coverage: 'La Serena a Calbuco',
        experience: 10
    }

    const milestones = [
        { year: 2015, title: 'Fundación', description: 'Nace El Descuevee en La Serena con un pequeño taller de bordados' },
        { year: 2017, title: 'Expansión', description: 'Abrimos nuestra primera tienda física y ampliamos catálogo de productos' },
        { year: 2019, title: 'Certificación', description: 'Obtenemos certificación de calidad en procesos de bordado' },
        { year: 2021, title: 'Crecimiento', description: 'Superamos los 500 clientes corporativos en la zona centro-norte' },
        { year: 2023, title: 'Innovación', description: 'Incorporamos tecnología de bordado 3D y nuevos productos' },
        { year: 2025, title: 'Consolidación', description: 'Nos consolidamos como referentes en ropa corporativa y bordado profesional' }
    ]

    const values = [
        { icon: 'verified', title: 'Calidad', description: 'Prendas y bordados que mantienen su presentación en el tiempo' },
        { icon: 'bolt', title: 'Agilidad', description: 'Respuesta rápida en cotizaciones y entregas' },
        { icon: 'handshake', title: 'Cercanía', description: 'Trato directo y personalizado con cada cliente' },
        { icon: 'recycling', title: 'Sostenibilidad', description: 'Compromiso con prácticas responsables y telas ecológicas' },
        { icon: 'groups', title: 'Trabajo en Equipo', description: 'Colaboración constante para ofrecer lo mejor' },
        { icon: 'trending_up', title: 'Mejora Continua', description: 'Innovación constante en productos y procesos' }
    ]

    const products = [
        { name: 'Línea Corporativa', items: 'Poleras Polo, Camisas Ejecutivas, Chaquetas', icon: 'work' },
        { name: 'Línea Industrial', items: 'Pantalones Cargo, Chalecos Geólogo, Jeans Reforzados', icon: 'construction' },
        { name: 'Bordado Profesional', items: 'Bordado 2D, 3D, Aplicado, Personalizado', icon: 'brush' },
        { name: 'Equipos Pequeños', items: 'Kits corporativos, Pedidos desde 10 unidades', icon: 'groups' }
    ]

    const goals = [
        { title: 'Corto Plazo', targets: ['Alcanzar 600 clientes corporativos', 'Incorporar 5 nuevos productos', 'Expandir zona de cobertura'] },
        { title: 'Mediano Plazo', targets: ['Certificación ISO en procesos', 'Apertura de segunda sucursal', 'Reducción del 30% en tiempos de entrega'] },
        { title: 'Largo Plazo', targets: ['Liderar mercado nacional', 'Exportar a países vecinos', 'Centro de innovación en bordado'] }
    ]

    const achievements = [
        { value: '+500', label: 'Clientes Corporativos', icon: 'groups' },
        { value: '+150K', label: 'Prendas Entregadas', icon: 'checkroom' },
        { value: '99%', label: 'Satisfacción', icon: 'star' },
        { value: '24h', label: 'Respuesta Garantizada', icon: 'schedule' }
    ]

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-primary to-primary-container py-20 md:py-28 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=400&fit=crop')] bg-cover bg-center"></div>
                </div>
                <div className="relative z-10 max-w-[1280px] mx-auto px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 uppercase tracking-tighter">Sobre Nosotros</h1>
                    <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                        Más de {companyInfo.experience} años potenciando la imagen de empresas con prendas bordadas que duran
                    </p>
                </div>
            </section>

            {/* Historia */}
            <section className="py-16">
                <div className="max-w-[1280px] mx-auto px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-[#FC9430] font-bold text-sm uppercase tracking-wider">Nuestra Historia</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 mt-2">Una trayectoria de calidad y compromiso</h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    El Descuevee nació en {companyInfo.foundingYear} en la ciudad de La Serena, con el sueño de ofrecer
                                    prendas de trabajo de alta calidad con bordados profesionales que realmente duraran en el tiempo.
                                    Lo que comenzó como un pequeño taller de bordado, hoy es una empresa referente en ropa corporativa.
                                </p>
                                <p>
                                    Nuestro nombre "Descuevee" (DCV) representa nuestras iniciales, pero con los años se ha convertido
                                    en sinónimo de calidad, durabilidad y atención cercana. Desde nuestros inicios, nos enfocamos en
                                    entender las necesidades reales de los trabajadores en terreno y en oficina.
                                </p>
                                <p>
                                    Hoy, con más de {companyInfo.employees} colaboradores y presencia desde La Serena hasta Calbuco,
                                    hemos vestido a más de {companyInfo.customers} empresas y entregado más de {companyInfo.productsSold.toLocaleString()}
                                    prendas personalizadas. Pero lo más importante: seguimos siendo la misma empresa cercana que entiende
                                    las verdaderas necesidades de nuestros clientes.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <img
                                    src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=300&fit=crop"
                                    alt="Taller de bordado"
                                    className="rounded-lg shadow-lg w-full h-48 object-cover"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop"
                                    alt="Proceso de bordado"
                                    className="rounded-lg shadow-lg w-full h-48 object-cover"
                                />
                            </div>
                            <div className="space-y-4 pt-8">
                                <img
                                    src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop"
                                    alt="Equipo de trabajo"
                                    className="rounded-lg shadow-lg w-full h-48 object-cover"
                                />
                                <img
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
                                    alt="Clientes satisfechos"
                                    className="rounded-lg shadow-lg w-full h-48 object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Línea de tiempo */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-[1280px] mx-auto px-8">
                    <div className="text-center mb-12">
                        <span className="text-[#FC9430] font-bold text-sm uppercase tracking-wider">Trayectoria</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">Nuestros Hitos</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Una década de crecimiento e innovación constante</p>
                    </div>

                    <div className="relative">
                        {/* Línea vertical para desktop */}
                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary/20 h-full"></div>

                        <div className="space-y-12">
                            {milestones.map((milestone, index) => (
                                <div key={index} className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                                    {/* Año */}
                                    <div className="md:w-1/2 flex justify-center md:justify-end">
                                        <div className="bg-primary text-white px-6 py-2 rounded-full font-bold">
                                            {milestone.year}
                                        </div>
                                    </div>

                                    {/* Contenido */}
                                    <div className="md:w-1/2">
                                        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                                            <h3 className="text-xl font-bold text-primary mb-2">{milestone.title}</h3>
                                            <p className="text-gray-600">{milestone.description}</p>
                                        </div>
                                    </div>

                                    {/* Marcador */}
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#FC9430] rounded-full border-4 border-white shadow-md hidden md:block"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Misión, Visión y Valores */}
            <section className="py-16">
                <div className="max-w-[1280px] mx-auto px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {/* Misión */}
                        <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-gray-100 hover:shadow-xl transition-shadow">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon name="target" className="text-3xl text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-4 uppercase">Misión</h3>
                            <p className="text-gray-600">
                                Potenciar la imagen de empresas y equipos de trabajo a través de prendas corporativas bordadas
                                de alta calidad, con atención personalizada, respuesta ágil y compromiso con la durabilidad.
                            </p>
                        </div>

                        {/* Visión */}
                        <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-gray-100 hover:shadow-xl transition-shadow">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon name="visibility" className="text-3xl text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-4 uppercase">Visión</h3>
                            <p className="text-gray-600">
                                Ser la empresa líder en ropa corporativa y bordado profesional en Chile, reconocida por nuestra
                                calidad, innovación y cercanía con el cliente, expandiendo nuestra cobertura a nivel nacional.
                            </p>
                        </div>

                        {/* Valores */}
                        <div className="bg-white p-8 rounded-xl shadow-lg text-center border border-gray-100 hover:shadow-xl transition-shadow">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon name="favorite" className="text-3xl text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-primary mb-4 uppercase">Valores</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>✓ Calidad y Durabilidad</li>
                                <li>✓ Cercanía y Trato Directo</li>
                                <li>✓ Respuesta Ágil</li>
                                <li>✓ Innovación Constante</li>
                                <li>✓ Compromiso y Confianza</li>
                            </ul>
                        </div>
                    </div>

                    {/* Lista detallada de valores */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {values.map((value, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Icon name={value.icon} className="text-xl text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-primary mb-1">{value.title}</h4>
                                    <p className="text-sm text-gray-600">{value.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Nuestros Productos */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-[1280px] mx-auto px-8">
                    <div className="text-center mb-12">
                        <span className="text-[#FC9430] font-bold text-sm uppercase tracking-wider">Catálogo</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">Nuestros Productos</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Soluciones completas para cada necesidad de tu equipo</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Icon name={product.icon} className="text-2xl text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-primary mb-2">{product.name}</h3>
                                <p className="text-sm text-gray-600">{product.items}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Objetivos y Metas */}
            <section className="py-16">
                <div className="max-w-[1280px] mx-auto px-8">
                    <div className="text-center mb-12">
                        <span className="text-[#FC9430] font-bold text-sm uppercase tracking-wider">Plan Estratégico</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">Objetivos y Metas</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Nuestra hoja de ruta para seguir creciendo y mejorando</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {goals.map((goal, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-[#FC9430]">
                                <h3 className="text-xl font-bold text-primary mb-4">{goal.title}</h3>
                                <ul className="space-y-3">
                                    {goal.targets.map((target, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-gray-600">
                                            <Icon name="check_circle" className="text-[#FC9430] text-sm mt-0.5" />
                                            <span>{target}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Logros */}
            <section className="bg-gradient-to-r from-primary to-primary-container py-16 text-white">
                <div className="max-w-[1280px] mx-auto px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Logros y Reconocimientos</h2>
                        <p className="text-white/80 max-w-2xl mx-auto">Números que respaldan nuestra trayectoria y compromiso</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {achievements.map((achievement, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Icon name={achievement.icon} className="text-2xl" />
                                </div>
                                <div className="text-3xl md:text-4xl font-bold mb-1">{achievement.value}</div>
                                <p className="text-sm text-white/80 uppercase font-semibold">{achievement.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonios */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-[1280px] mx-auto px-8">
                    <div className="text-center mb-12">
                        <span className="text-[#FC9430] font-bold text-sm uppercase tracking-wider">Testimonios</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-4">Lo que dicen nuestros clientes</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Empresas que confían en nuestra calidad y servicio</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <Icon name="format_quote" className="text-4xl text-[#FC9430] mb-4" />
                            <p className="text-gray-600 mb-4">
                                "Excelente calidad en las prendas y el bordado. El equipo de El Descuevee nos asesoró
                                perfectamente y cumplieron con los tiempos acordados."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                    <span className="text-primary font-bold">MP</span>
                                </div>
                                <div>
                                    <p className="font-bold text-primary">María Pérez</p>
                                    <p className="text-xs text-gray-500">Minera Las Ánimas</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <Icon name="format_quote" className="text-4xl text-[#FC9430] mb-4" />
                            <p className="text-gray-600 mb-4">
                                "Pedimos uniformes para toda nuestra constructora. La atención fue rápida y el bordado
                                quedó perfecto. Muy recomendables."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                    <span className="text-primary font-bold">CT</span>
                                </div>
                                <div>
                                    <p className="font-bold text-primary">Carlos Torres</p>
                                    <p className="text-xs text-gray-500">Constructora Titán</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <Icon name="format_quote" className="text-4xl text-[#FC9430] mb-4" />
                            <p className="text-gray-600 mb-4">
                                "El equipo de El Descuevee entendió nuestras necesidades y nos entregó productos de alta
                                calidad. El bordado 3D superó nuestras expectativas."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                    <span className="text-primary font-bold">IL</span>
                                </div>
                                <div>
                                    <p className="font-bold text-primary">Ignacio López</p>
                                    <p className="text-xs text-gray-500">Industrias López</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-16">
                <div className="max-w-[1280px] mx-auto px-8">
                    <div className="bg-gradient-to-r from-primary to-primary-container rounded-2xl p-8 md:p-12 text-center text-white">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Listo para potenciar la imagen de tu equipo?</h2>
                        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                            Cotiza hoy mismo y descubre por qué más de 500 empresas confían en nosotros
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/catalogo"
                                className="bg-white text-primary px-6 py-3 font-bold uppercase rounded-lg hover:bg-gray-100 transition-all"
                            >
                                Ver Catálogo
                            </Link>
                            <Link
                                to="/contacto"
                                className="border-2 border-white text-white px-6 py-3 font-bold uppercase rounded-lg hover:bg-white/10 transition-all"
                            >
                                Contactar Ahora
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}