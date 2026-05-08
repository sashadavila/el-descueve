import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import { allProducts, getProductsByCategory, categories } from '../../data/mockData'

export default function CatalogoPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoria') || 'all')
    const [priceSort, setPriceSort] = useState('default')
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredProducts, setFilteredProducts] = useState(allProducts)

    // Filtrar productos cuando cambie la categoría o búsqueda
    useEffect(() => {
        let products = selectedCategory === 'all'
            ? allProducts
            : getProductsByCategory(selectedCategory)

        // Filtrar por término de búsqueda
        if (searchTerm) {
            products = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.reference.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Ordenar por precio
        if (priceSort === 'asc') {
            products = [...products].sort((a, b) => a.price - b.price)
        } else if (priceSort === 'desc') {
            products = [...products].sort((a, b) => b.price - a.price)
        }

        setFilteredProducts(products)
    }, [selectedCategory, priceSort, searchTerm])

    // Actualizar URL cuando cambia la categoría
    useEffect(() => {
        if (selectedCategory === 'all') {
            searchParams.delete('categoria')
        } else {
            searchParams.set('categoria', selectedCategory)
        }
        setSearchParams(searchParams)
    }, [selectedCategory, searchParams, setSearchParams])

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId)
    }

    const handlePriceSort = (e) => {
        setPriceSort(e.target.value)
    }

    const handleClearFilters = () => {
        setSelectedCategory('all')
        setPriceSort('default')
        setSearchTerm('')
    }

    // Obtener el nombre de la categoría seleccionada
    const getSelectedCategoryName = () => {
        if (selectedCategory === 'all') return 'Todos los Productos'
        const category = categories.find(c => c.id === selectedCategory)
        return category ? category.name : 'Productos'
    }

    return (
        <div className="max-w-[1280px] mx-auto flex min-h-screen">
            {/* Sidebar Filters */}
            <aside className="hidden md:flex flex-col py-6 gap-4 bg-slate-50 h-auto w-64 border-r border-slate-200 shrink-0">
                <div className="px-6 mb-4">
                    <h2 className="text-[#163C7A] font-bold text-sm uppercase">FILTROS</h2>
                    <p className="text-slate-500 text-[10px] tracking-widest uppercase">CATEGORÍAS</p>
                </div>

                <nav className="flex flex-col gap-1">
                    <button
                        onClick={() => handleCategoryChange('all')}
                        className={`px-6 py-3 flex items-center gap-3 text-sm font-semibold uppercase transition-colors ${selectedCategory === 'all'
                                ? 'bg-white text-[#163C7A] border-l-4 border-[#FC9430]'
                                : 'text-slate-500 hover:bg-slate-100'
                            }`}
                    >
                        <span className="material-symbols-outlined">grid_view</span>
                        TODOS LOS PRODUCTOS
                        <span className="ml-auto text-xs text-slate-400">{allProducts.length}</span>
                    </button>

                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.id)}
                            className={`px-6 py-3 flex items-center gap-3 text-sm font-semibold uppercase transition-colors ${selectedCategory === cat.id
                                    ? 'bg-white text-[#163C7A] border-l-4 border-[#FC9430]'
                                    : 'text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            <span className="material-symbols-outlined">{cat.icon}</span>
                            {cat.name}
                            <span className="ml-auto text-xs text-slate-400">{cat.count}</span>
                        </button>
                    ))}
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
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-outline-variant focus:ring-1 focus:ring-primary outline-none rounded"
                        />
                    </div>
                </div>

                {/* Botón limpiar filtros */}
                <div className="mt-6 px-6">
                    <button
                        onClick={handleClearFilters}
                        className="w-full bg-[#FC9430] text-white py-3 font-bold uppercase tracking-widest text-sm hover:bg-[#e0852b] transition-all"
                    >
                        Limpiar Filtros
                    </button>
                </div>

                {/* Información adicional */}
                <div className="mt-auto px-6 py-4 border-t border-slate-200">
                    <div className="text-center">
                        <Icon name="local_shipping" className="text-[#FC9430] text-2xl" />
                        <p className="text-xs font-bold text-primary mt-2">Pedido mínimo 10 unidades</p>
                        <p className="text-[10px] text-on-surface-variant">Combinación de tallas y colores</p>
                    </div>
                </div>
            </aside>

            {/* Product Grid */}
            <section className="flex-1 p-6 bg-surface">
                {/* Header con título y ordenamiento */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b-2 border-surface-container-highest pb-4 gap-4">
                    <div>
                        <nav className="flex gap-2 text-xs text-on-surface-variant mb-2">
                            <Link to="/" className="hover:text-primary">INICIO</Link>
                            <span>/</span>
                            <span className="text-primary font-bold">CATÁLOGO</span>
                        </nav>
                        <h1 className="text-2xl font-bold text-primary uppercase">{getSelectedCategoryName()}</h1>
                        <p className="text-on-surface-variant text-sm mt-2">
                            {filteredProducts.length} productos encontrados
                        </p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <span className="text-xs uppercase text-on-surface-variant hidden sm:inline">Ordenar por:</span>
                        <select
                            value={priceSort}
                            onChange={handlePriceSort}
                            className="bg-transparent border border-outline-variant px-3 py-2 text-sm font-bold text-primary focus:ring-1 focus:ring-primary outline-none rounded"
                        >
                            <option value="default">MÁS RELEVANTES</option>
                            <option value="asc">PRECIO: MENOR A MAYOR</option>
                            <option value="desc">PRECIO: MAYOR A MENOR</option>
                        </select>
                    </div>
                </div>

                {/* Grid de productos */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <Icon name="search_off" className="text-6xl text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-primary mb-2">No se encontraron productos</h3>
                        <p className="text-on-surface-variant">Prueba con otros filtros o categorías</p>
                        <button
                            onClick={handleClearFilters}
                            className="mt-4 bg-[#FC9430] text-white px-6 py-2 font-bold uppercase text-sm hover:bg-[#e0852b] transition-colors rounded"
                        >
                            Limpiar filtros
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {/* Sección de características clave */}
                <div className="mt-12 p-6 bg-surface-container-low rounded-xl border border-outline-variant">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <Icon name="verified" className="text-primary text-3xl mx-auto" />
                            <h4 className="font-bold text-primary uppercase text-sm mt-2">Calidad Garantizada</h4>
                            <p className="text-xs text-on-surface-variant">Prendas y bordados que mantienen presentación en el tiempo</p>
                        </div>
                        <div>
                            <Icon name="bolt" className="text-primary text-3xl mx-auto" />
                            <h4 className="font-bold text-primary uppercase text-sm mt-2">Respuesta Ágil</h4>
                            <p className="text-xs text-on-surface-variant">Cotizaciones rápidas, claras y sin rodeos</p>
                        </div>
                        <div>
                            <Icon name="handshake" className="text-primary text-3xl mx-auto" />
                            <h4 className="font-bold text-primary uppercase text-sm mt-2">Trato Directo</h4>
                            <p className="text-xs text-on-surface-variant">Hablamos cercano para orientarte mejor</p>
                        </div>
                        <div>
                            <Icon name="local_shipping" className="text-primary text-3xl mx-auto" />
                            <h4 className="font-bold text-primary uppercase text-sm mt-2">Envíos a Todo Chile</h4>
                            <p className="text-xs text-on-surface-variant">Desde La Serena hasta Calbuco</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

// Componente ProductCard interno
function ProductCard({ product }) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="bg-white border border-outline-variant group hover:border-primary transition-all duration-300 flex flex-col relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.isNew && (
                    <span className="bg-green-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter">
                        NUEVO
                    </span>
                )}
                {product.hasDiscount && (
                    <span className="bg-error text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter">
                        -{product.discount}% DCTO
                    </span>
                )}
                {product.isFeatured && !product.isNew && !product.hasDiscount && (
                    <span className="bg-primary text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter">
                        TOP VENTAS
                    </span>
                )}
            </div>

            {/* Imagen */}
            <Link to={`/producto/${product.id}`}>
                <div className="aspect-square overflow-hidden bg-surface-container-low p-6">
                    <img
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        src={product.image}
                    />
                </div>
            </Link>

            {/* Información */}
            <div className="p-6 flex flex-col flex-1">
                <p className="text-label-sm text-on-surface-variant mb-1 uppercase">{product.subcategory || product.category}</p>
                <Link to={`/producto/${product.id}`}>
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

                <div className="mt-auto flex justify-between items-end">
                    <div className="flex flex-col">
                        {product.hasDiscount ? (
                            <>
                                <span className="text-[10px] text-on-surface-variant line-through">${(product.price * (1 + product.discount / 100)).toLocaleString()} CLP</span>
                                <span className="text-h3 text-[#FC9430] font-black">${product.price.toLocaleString()} CLP</span>
                            </>
                        ) : (
                            <span className="text-h3 text-[#FC9430] font-black">${product.price.toLocaleString()} CLP</span>
                        )}
                        <span className="text-[10px] text-on-surface-variant">Desde {product.minOrder} unidades</span>
                    </div>
                    <Link
                        to={`/producto/${product.id}`}
                        className="text-[10px] font-bold text-on-surface uppercase border-b border-primary hover:text-primary transition-colors"
                    >
                        VER DETALLES
                    </Link>
                </div>
            </div>

            {/* Botones que aparecen al hover */}
            {isHovered && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-all">
                    <Link
                        to={`/producto/${product.id}`}
                        className="bg-white text-primary px-4 py-2 text-xs font-bold uppercase hover:bg-primary hover:text-white transition-colors rounded"
                    >
                        Ver Detalles
                    </Link>
                    <button
                        className="bg-[#FC9430] text-white px-4 py-2 text-xs font-bold uppercase hover:brightness-110 transition-colors rounded"
                    >
                        Cotizar
                    </button>
                </div>
            )}
        </div>
    )
}