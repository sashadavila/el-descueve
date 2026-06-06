import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import { useAuth } from '../../hooks/useAuth'
import api from '../../config/api'

export default function CatalogoPage() {
    const { isAuthenticated } = useAuth()
    const [searchParams, setSearchParams] = useSearchParams()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalProducts, setTotalProducts] = useState(0)

    // Filtros
    const [selectedType, setSelectedType] = useState(searchParams.get('tipo') || 'all')
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoria') || 'all')
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('default')

    const itemsPerPage = 15

    // Cargar productos desde el backend
    const loadProducts = async () => {
        setLoading(true)
        try {
            // ✅ SOLO estos filtros - NO incluir isFeatured o isNew
            const filters = {}

            if (selectedType && selectedType !== 'all') {
                filters.productType = selectedType
            }
            if (selectedCategory && selectedCategory !== 'all') {
                filters.categoryId = selectedCategory
            }
            if (searchTerm && searchTerm.trim()) {
                filters.search = searchTerm
            }
            if (sortBy === 'price_asc') {
                filters.sortBy = 'price'
                filters.sortOrder = 'ASC'
            } else if (sortBy === 'price_desc') {
                filters.sortBy = 'price'
                filters.sortOrder = 'DESC'
            }

            // IMPORTANTE: No agregar isFeatured o isNew

            console.log('📊 [CatalogoPage] Enviando filtros:', filters)

            const response = await api.products.getAll(currentPage, itemsPerPage, filters)

            console.log('📊 Productos cargados:', response.data?.length, 'de', response.total)

            setProducts(response.data || [])
            setTotalPages(response.totalPages || 1)
            setTotalProducts(response.total || 0)
        } catch (error) {
            console.error('Error loading products:', error)
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProducts()
    }, [currentPage, selectedType, selectedCategory, sortBy])

    // Actualizar URL cuando cambian los filtros
    useEffect(() => {
        const params = new URLSearchParams()
        if (selectedType !== 'all') params.set('tipo', selectedType)
        if (selectedCategory !== 'all') params.set('categoria', selectedCategory)
        setSearchParams(params)
    }, [selectedType, selectedCategory])

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleClearFilters = () => {
        setSelectedType('all')
        setSelectedCategory('all')
        setSearchTerm('')
        setSortBy('default')
        setCurrentPage(1)
    }

    const Pagination = () => {
        if (totalPages <= 1) return null

        const pages = []
        const maxVisible = 5
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
        let endPage = Math.min(totalPages, startPage + maxVisible - 1)

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }

        return (
            <div className="flex justify-center items-center gap-2 mt-8">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    Anterior
                </button>

                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="px-2">...</span>}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 text-sm border rounded-lg transition-colors ${currentPage === page
                            ? 'bg-primary text-white border-primary'
                            : 'hover:bg-gray-50'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="px-2">...</span>}
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    Siguiente
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-[1280px] mx-auto flex min-h-screen">
            {/* Sidebar Filters */}
            <aside className="hidden md:flex flex-col py-6 gap-4 bg-slate-50 h-auto w-64 border-r border-slate-200 shrink-0">
                <div className="px-6 mb-4">
                    <h2 className="text-[#163C7A] font-bold text-sm uppercase">FILTROS</h2>
                    <p className="text-slate-500 text-[10px] tracking-widest uppercase">TIPO DE PRODUCTO</p>
                </div>

                <nav className="flex flex-col gap-1">
                    <button
                        onClick={() => setSelectedType('all')}
                        className={`px-6 py-3 flex items-center gap-3 text-sm font-semibold uppercase transition-colors w-full text-left ${selectedType === 'all'
                            ? 'bg-white text-[#163C7A] border-l-4 border-[#FC9430]'
                            : 'text-slate-500 hover:bg-slate-100'
                            }`}
                    >
                        <Icon name="grid_view" />
                        TODOS LOS PRODUCTOS
                    </button>

                    <button
                        onClick={() => setSelectedType('corporativo')}
                        className={`px-6 py-3 flex items-center gap-3 text-sm font-semibold uppercase transition-colors w-full text-left ${selectedType === 'corporativo'
                            ? 'bg-white text-[#163C7A] border-l-4 border-[#FC9430]'
                            : 'text-slate-500 hover:bg-slate-100'
                            }`}
                    >
                        <Icon name="work" />
                        CORPORATIVO
                    </button>

                    <button
                        onClick={() => setSelectedType('industrial')}
                        className={`px-6 py-3 flex items-center gap-3 text-sm font-semibold uppercase transition-colors w-full text-left ${selectedType === 'industrial'
                            ? 'bg-white text-[#163C7A] border-l-4 border-[#FC9430]'
                            : 'text-slate-500 hover:bg-slate-100'
                            }`}
                    >
                        <Icon name="construction" />
                        INDUSTRIAL
                    </button>

                    <button
                        onClick={() => setSelectedType('bordados')}
                        className={`px-6 py-3 flex items-center gap-3 text-sm font-semibold uppercase transition-colors w-full text-left ${selectedType === 'bordados'
                            ? 'bg-white text-[#163C7A] border-l-4 border-[#FC9430]'
                            : 'text-slate-500 hover:bg-slate-100'
                            }`}
                    >
                        <Icon name="brush" />
                        BORDADOS
                    </button>

                    <button
                        onClick={() => setSelectedType('equipos')}
                        className={`px-6 py-3 flex items-center gap-3 text-sm font-semibold uppercase transition-colors w-full text-left ${selectedType === 'equipos'
                            ? 'bg-white text-[#163C7A] border-l-4 border-[#FC9430]'
                            : 'text-slate-500 hover:bg-slate-100'
                            }`}
                    >
                        <Icon name="groups" />
                        EQUIPOS
                    </button>
                </nav>

                {/* Búsqueda */}
                <div className="mt-6 px-6">
                    <h3 className="text-xs font-bold text-primary mb-3 uppercase">Búsqueda</h3>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <Icon name="search" className="text-slate-400 text-sm" />
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && loadProducts()}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-outline-variant focus:ring-1 focus:ring-primary outline-none rounded"
                        />
                    </div>
                </div>

                {/* Botón limpiar filtros */}
                <div className="mt-6 px-6">
                    <button
                        onClick={handleClearFilters}
                        className="w-full bg-[#FC9430] text-white py-3 font-bold uppercase tracking-widest text-sm hover:bg-[#e0852b] transition-all rounded"
                    >
                        Limpiar Filtros
                    </button>
                </div>
            </aside>

            {/* Product Grid */}
            <section className="flex-1 p-6 bg-surface">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b-2 border-surface-container-highest pb-4 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-primary uppercase">Catálogo de Productos</h1>
                        <p className="text-on-surface-variant text-sm mt-2">
                            {totalProducts} productos encontrados - Página {currentPage} de {totalPages}
                        </p>
                    </div>
                    {isAuthenticated && (
                        <div className="flex gap-4 items-center">
                            <span className="text-xs uppercase text-on-surface-variant hidden sm:inline">Ordenar por:</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent border border-outline-variant px-3 py-2 text-sm font-bold text-primary focus:ring-1 focus:ring-primary outline-none rounded"
                            >
                                <option value="default">MÁS RELEVANTES</option>
                                <option value="price_asc">PRECIO: MENOR A MAYOR</option>
                                <option value="price_desc">PRECIO: MAYOR A MENOR</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Grid de productos */}
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <Icon name="search_off" className="text-6xl text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">No se encontraron productos</h3>
                        <p className="text-on-surface-variant">Prueba con otros filtros</p>
                        <button
                            onClick={handleClearFilters}
                            className="mt-4 bg-[#FC9430] text-white px-6 py-2 font-bold uppercase text-sm hover:bg-[#e0852b] transition-colors rounded"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Paginación */}
                        <Pagination />
                    </>
                )}
            </section>
        </div>
    )
}

// Componente ProductCard
function ProductCard({ product }) {
    const { isAuthenticated } = useAuth()
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="bg-white border border-outline-variant group hover:border-primary transition-all duration-300 flex flex-col relative rounded-lg overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.isNew && (
                    <span className="bg-green-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded">
                        NUEVO
                    </span>
                )}
                {product.hasDiscount && (
                    <span className="bg-red-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded">
                        -{product.discount}% DCTO
                    </span>
                )}
                {product.isFeatured && !product.isNew && !product.hasDiscount && (
                    <span className="bg-primary text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded">
                        TOP VENTAS
                    </span>
                )}
            </div>

            {/* Imagen */}
            <Link to={isAuthenticated ? `/producto/${product.id}` : "/login"}>
                <div className="aspect-square overflow-hidden bg-surface-container-low p-6">
                    <img
                        src={product.imageUrl || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400?text=Sin+Imagen'
                        }}
                    />
                </div>
            </Link>

            {/* Información */}
            <div className="p-6 flex flex-col flex-1">
                <p className="text-label-sm text-on-surface-variant mb-1 uppercase">{product.subcategory || product.productType}</p>
                <Link to={isAuthenticated ? `/producto/${product.id}` : "/login"}>
                    <h3 className="font-h3 text-lg text-primary mb-2 group-hover:text-secondary transition-colors uppercase line-clamp-2">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-xs text-on-surface-variant mb-4 line-clamp-2">
                    {product.description}
                </p>

                {/* Especificaciones rápidas */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {product.embroidery?.included && (
                        <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase font-bold">
                            Bordado Incluido
                        </span>
                    )}
                    {product.reinforcement && (
                        <span className="text-[9px] bg-secondary-container/10 text-secondary-container px-2 py-0.5 rounded-full uppercase font-bold">
                            Reforzado
                        </span>
                    )}
                    {product.reflective && (
                        <span className="text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full uppercase font-bold">
                            Reflectante
                        </span>
                    )}
                    {product.thermal && (
                        <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase font-bold">
                            Térmico
                        </span>
                    )}
                </div>

                {/* Precio */}
                <div className="mt-auto flex justify-between items-end">
                    <div className="flex flex-col">
                        {isAuthenticated ? (
                            <>
                                {product.hasDiscount ? (
                                    <>
                                        <span className="text-[10px] text-on-surface-variant line-through">
                                            ${(product.comparePrice || product.price * (1 + product.discount / 100)).toLocaleString()} CLP
                                        </span>
                                        <span className="text-h3 text-[#FC9430] font-black">${product.price.toLocaleString()} CLP</span>
                                    </>
                                ) : (
                                    <span className="text-h3 text-[#FC9430] font-black">${product.price.toLocaleString()} CLP</span>
                                )}
                                <span className="text-[10px] text-on-surface-variant">Desde {product.minOrder} unidades</span>
                            </>
                        ) : (
                            <>
                                <span className="text-h3 text-[#FC9430] font-black">Inicia sesión</span>
                                <span className="text-[10px] text-on-surface-variant">Para ver precios</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Overlay hover */}
            {isHovered && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-all">
                    <Link
                        to={isAuthenticated ? `/producto/${product.id}` : "/login"}
                        className="bg-white text-primary px-4 py-2 text-xs font-bold uppercase hover:bg-primary hover:text-white transition-colors rounded"
                    >
                        {isAuthenticated ? "Ver Detalles" : "Iniciar Sesión"}
                    </Link>
                </div>
            )}
        </div>
    )
}