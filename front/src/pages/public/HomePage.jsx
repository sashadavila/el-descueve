// src/pages/public/HomePage.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import SolutionDetailModal from '../../components/ui/SolutionDetailModal'
import FeaturedProductCard from '../../components/ui/FeaturedProductCard'
import api from '../../config/api'

export default function HomePage() {
    const navigate = useNavigate()
    const [selectedSolution, setSelectedSolution] = useState(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [featuredProducts, setFeaturedProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [retryCount, setRetryCount] = useState(0)

    // Definición de soluciones con IDs de categorías (se actualizarán dinámicamente)
    const solutions = [
        {
            id: 'corporativo',
            title: 'Poleras y Camisas',
            category: 'LÍNEA CORPORATIVA',
            badge: 'MÁS VENDIDO',
            badgeColor: 'bg-secondary-container',
            price: 'Desde $12.900 CLP',
            description: 'Prendas profesionales para imagen corporativa. Bordado personalizado incluido.',
            image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=400&fit=crop',
            categoryId: null,
            categoryName: 'corporativo'
        },
        {
            id: 'industrial',
            title: 'Ropa de Trabajo',
            category: 'LÍNEA INDUSTRIAL',
            badge: 'DURADERO',
            badgeColor: 'bg-primary',
            price: 'Desde $28.900 CLP',
            description: 'Pantalones cargo, chalecos geólogo y prendas resistentes para terreno.',
            image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
            categoryId: null,
            categoryName: 'industrial'
        },
        {
            id: 'bordado',
            title: 'Bordado de Logo',
            category: 'PERSONALIZACIÓN',
            badge: 'BORDADO INCLUIDO',
            badgeColor: 'bg-secondary-container',
            price: 'Desde $10.000 CLP',
            description: 'Bordado profesional de alta calidad en todas tus prendas corporativas.',
            image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=400&fit=crop',
            categoryId: null,
            categoryName: 'bordados'
        },
        {
            id: 'equipos',
            title: 'Desde 10 Prendas',
            category: 'EQUIPOS PEQUEÑOS',
            badge: 'FLEXIBLE',
            badgeColor: 'bg-primary',
            price: 'Precios B2B',
            description: 'Soluciones flexibles combinando diferentes prendas, tallas y colores.',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop',
            categoryId: null,
            categoryName: 'equipos'
        }
    ]

    // Función para cargar datos con reintento
    const fetchHomeData = async (retry = false) => {
        setLoading(true)
        setError(null)

        try {
            // Intentar cargar categorías y productos en paralelo
            const [categoriesResponse, productsResponse] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/categories`),
                api.products.getAll(1, 8, { isFeatured: true })
            ])

            // Procesar categorías
            if (!categoriesResponse.ok) {
                throw new Error(`Error ${categoriesResponse.status}: No se pudieron cargar las categorías`)
            }

            const categoriesData = await categoriesResponse.json()

            if (!categoriesData || categoriesData.length === 0) {
                throw new Error('No hay categorías disponibles en la base de datos')
            }

            setCategories(categoriesData)

            // Mapear soluciones a IDs de categorías reales
            const updatedSolutions = solutions.map(solution => {
                const matchedCategory = categoriesData.find(c =>
                    c.name?.toLowerCase().includes(solution.categoryName) ||
                    c.name?.toLowerCase().includes(solution.id) ||
                    (solution.id === 'corporativo' && c.name?.toLowerCase().includes('polera')) ||
                    (solution.id === 'industrial' && c.name?.toLowerCase().includes('pantalon')) ||
                    (solution.id === 'bordado' && c.name?.toLowerCase().includes('bordado')) ||
                    (solution.id === 'equipos' && (c.name?.toLowerCase().includes('equipo') || c.name?.toLowerCase().includes('kit')))
                )
                return {
                    ...solution,
                    categoryId: matchedCategory?.id || null
                }
            })

            // Actualizar las soluciones con los IDs encontrados
            solutions.forEach((sol, idx) => {
                sol.categoryId = updatedSolutions[idx].categoryId
            })

            // Procesar productos destacados
            if (!productsResponse || !productsResponse.data) {
                throw new Error('No se pudieron cargar los productos destacados')
            }

            const formattedProducts = productsResponse.data.map(product => ({
                id: product.id,
                name: product.name,
                description: product.description,
                price: typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0,
                image: product.imageUrl || product.images?.[0] || 'https://via.placeholder.com/400',
                minOrder: product.minOrder || 10,
                reference: product.reference,
                isNew: product.isNew || false,
                isFeatured: product.isFeatured || false,
                hasDiscount: product.hasDiscount || false,
                discount: product.discount || 0,
                inStock: (product.stock || 0) > 0
            }))

            setFeaturedProducts(formattedProducts)

        } catch (err) {
            console.error('Error fetching home data:', err)

            // Si hay error y es el primer intento, reintentar después de 2 segundos
            if (retryCount < 2 && !retry) {
                console.log(`Reintentando cargar datos... (intento ${retryCount + 1}/2)`)
                setRetryCount(prev => prev + 1)
                setTimeout(() => fetchHomeData(true), 2000)
                return
            }

            // Determinar el mensaje de error específico
            let errorMessage = 'No se pudieron cargar los datos desde el servidor'

            if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
                errorMessage = '⚠️ No se pudo conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3000'
            } else if (err.message.includes('401') || err.message.includes('Unauthorized')) {
                errorMessage = '⚠️ Error de autenticación. Por favor, inicia sesión nuevamente.'
            } else if (err.message.includes('404')) {
                errorMessage = '⚠️ El servidor no responde correctamente. Verifica la configuración de la API.'
            } else if (err.message.includes('No hay categorías')) {
                errorMessage = '⚠️ No hay categorías registradas en la base de datos. Contacta al administrador.'
            } else if (err.message.includes('No se pudieron cargar los productos')) {
                errorMessage = '⚠️ No hay productos disponibles en este momento.'
            } else {
                errorMessage = `⚠️ Error: ${err.message}`
            }

            setError(errorMessage)
            setFeaturedProducts([])
            setCategories([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchHomeData()
    }, [])

    const handleViewDetails = (solution) => {
        setSelectedSolution(solution)
        setModalOpen(true)
    }

    const handleCloseModal = () => {
        setModalOpen(false)
        setSelectedSolution(null)
    }

    const handleCotizar = () => {
        navigate('/contacto')
    }

    const handleRetry = () => {
        setRetryCount(0)
        fetchHomeData()
    }

    // Pantalla de error - Muestra un mensaje claro cuando no se pueden cargar los datos
    if (error && !loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="text-center max-w-md mx-auto">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon name="error" className="text-5xl text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-3">No se pudieron cargar los datos</h1>
                    <p className="text-gray-600 mb-2">{error}</p>
                    <p className="text-sm text-gray-500 mb-6">
                        Verifica que el servidor backend esté corriendo en <strong>http://localhost:3000</strong>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={handleRetry}
                            className="bg-[#FC9430] text-white px-6 py-3 font-bold uppercase rounded-lg hover:bg-[#e0852b] transition-colors flex items-center justify-center gap-2"
                        >
                            <Icon name="refresh" className="text-sm" />
                            Reintentar
                        </button>
                        <Link
                            to="/contacto"
                            className="border-2 border-gray-300 text-gray-700 px-6 py-3 font-bold uppercase rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Contactar Soporte
                        </Link>
                    </div>
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left">
                        <p className="text-xs text-gray-500 font-mono">
                            <strong>Debug:</strong><br />
                            API URL: {import.meta.env.VITE_API_URL || 'http://localhost:3000'}<br />
                            Estado: {error.includes('conectar') ? '❌ Sin conexión' : '⚠️ Error en respuesta'}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    // Pantalla de carga
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FC9430] mx-auto"></div>
                    <p className="mt-4 text-gray-500 font-medium">Cargando página de inicio...</p>
                    <p className="text-xs text-gray-400 mt-2">Conectando con el servidor</p>
                </div>
            </div>
        )
    }

    // Si no hay productos destacados pero no hay error, mostrar mensaje informativo
    const hasNoProducts = featuredProducts.length === 0 && !loading && !error

    return (
        <div>
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://www.eldescuevee.cl/categoria-bordado.jpg"
                        alt="Ropa corporativa bordada"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=1920&h=600&fit=crop'
                        }}
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
                                to="/contacto"
                                className="bg-[#FC9430] text-white px-8 py-4 font-bold uppercase tracking-wider hover:brightness-110 transition-all active:scale-95 rounded"
                            >
                                Cotizar desde 10 prendas
                            </Link>
                            <Link
                                to="/catalogo"
                                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 font-bold uppercase tracking-wider hover:bg-white/30 transition-all rounded"
                            >
                                Ver Catálogo
                            </Link>
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
                    ].map((item) => (
                        <div key={item.title} className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-16 h-16 bg-primary flex items-center justify-center text-white group-hover:bg-[#FC9430] transition-colors rounded">
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
                        <div key={solution.id} className="bg-white border border-outline-variant group hover:border-primary transition-all duration-300 flex flex-col relative rounded-lg overflow-hidden">
                            <div className="absolute top-4 left-4 z-10">
                                <span className={`${solution.badgeColor} text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded`}>
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
                                </div>
                            </div>
                            <div className="p-4 pt-0 grid grid-cols-2 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleViewDetails(solution)}
                                    className="bg-white border-2 border-primary text-primary py-2 text-xs font-bold uppercase hover:bg-surface-container transition-colors rounded"
                                >
                                    Ver Detalles
                                </button>
                                <button
                                    onClick={handleCotizar}
                                    className="bg-secondary-container text-on-secondary-container py-2 text-xs font-bold uppercase hover:bg-[#e0852b] transition-colors rounded"
                                >
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

                {hasNoProducts ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <Icon name="inventory_2" className="text-5xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No hay productos destacados disponibles en este momento</p>
                        <p className="text-xs text-gray-400 mt-2">Agrega productos desde el panel de administrador</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.map(product => (
                            <FeaturedProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
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