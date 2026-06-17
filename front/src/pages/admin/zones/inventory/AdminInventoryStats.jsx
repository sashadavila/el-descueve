// src/pages/admin/zones/inventory/AdminInventoryStats.jsx
import { useState, useEffect } from 'react'
import Icon from '../../../../components/ui/Icon'
import api from '../../../../config/api'

export default function AdminInventoryStats() {
    const [stats, setStats] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // ✅ Estado para paginación de la tabla de productos con stock bajo
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true)
                const [statsData, productsData] = await Promise.all([
                    api.products.getStats(),
                    api.products.getAll(1, 100)
                ])
                setStats(statsData)
                setProducts(productsData.data || [])
            } catch (err) {
                console.error('Error fetching inventory stats:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    // Productos por categoría
    const getProductsByType = () => {
        const byType = {
            corporativo: products.filter(p => p.productType === 'corporativo').length,
            industrial: products.filter(p => p.productType === 'industrial').length,
            bordados: products.filter(p => p.productType === 'bordados').length,
            equipos: products.filter(p => p.productType === 'equipos').length
        }
        return byType
    }

    // Productos con stock bajo (menos de 10)
    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 10)

    // Productos sin stock
    const outOfStockProducts = products.filter(p => p.stock === 0)

    // Productos activos vs inactivos
    const activeProducts = products.filter(p => p.isActive).length
    const inactiveProducts = products.filter(p => !p.isActive).length

    // ✅ Combinar productos con problemas de stock para paginación
    const problemProducts = [...lowStockProducts, ...outOfStockProducts]
    const totalProblemProducts = problemProducts.length

    // ✅ Obtener productos paginados
    const getPaginatedProducts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return problemProducts.slice(startIndex, endIndex)
    }

    // ✅ Calcular total de páginas
    const totalPages = Math.ceil(totalProblemProducts / itemsPerPage)

    // ✅ Cambiar página
    const handlePageChange = (page) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // ✅ Componente de paginación
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
            <div className="flex justify-center items-center gap-2 mt-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    Anterior
                </button>

                {startPage > 1 && (
                    <>
                        <button onClick={() => handlePageChange(1)} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition-colors">1</button>
                        {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${currentPage === page
                                ? 'bg-primary text-white border-primary'
                                : 'hover:bg-gray-50'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
                        <button onClick={() => handlePageChange(totalPages)} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition-colors">
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    Siguiente
                </button>
            </div>
        )
    }

    // ✅ Calcular rango de registros mostrados
    const getDisplayRange = () => {
        const start = (currentPage - 1) * itemsPerPage + 1
        const end = Math.min(currentPage * itemsPerPage, totalProblemProducts)
        return { start, end }
    }

    const byType = getProductsByType()
    const totalProducts = products.length
    const activePercentage = totalProducts > 0 ? Math.round((activeProducts / totalProducts) * 100) : 0
    const paginatedProducts = getPaginatedProducts()
    const { start, end } = getDisplayRange()

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">Error al cargar estadísticas: {error}</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                    <Icon name="bar_chart" className="text-4xl" />
                    Estadísticas de Inventario
                </h2>
                <p className="text-on-surface-variant mt-1">Métricas y análisis de productos</p>
            </div>

            {/* Cards de métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon name="inventory_2" className="text-2xl text-primary" />
                        </div>
                        <span className="text-3xl font-bold text-primary">{totalProducts}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Total Productos</h3>
                    <p className="text-xs text-gray-500 mt-1">Catálogo completo</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Icon name="check_circle" className="text-2xl text-green-600" />
                        </div>
                        <span className="text-3xl font-bold text-green-600">{activePercentage}%</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Activos</h3>
                    <p className="text-xs text-gray-500 mt-1">{activeProducts} productos visibles</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Icon name="warning" className="text-2xl text-yellow-600" />
                        </div>
                        <span className="text-3xl font-bold text-yellow-600">{lowStockProducts.length}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Stock Bajo</h3>
                    <p className="text-xs text-gray-500 mt-1">Menos de 10 unidades</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <Icon name="error" className="text-2xl text-red-600" />
                        </div>
                        <span className="text-3xl font-bold text-red-600">{outOfStockProducts.length}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Sin Stock</h3>
                    <p className="text-xs text-gray-500 mt-1">Agotados temporalmente</p>
                </div>
            </div>

            {/* Distribución por Tipo */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
                        <Icon name="pie_chart" />
                        Distribución por Tipo
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(byType).map(([type, count]) => {
                            const percentage = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0
                            const colors = {
                                corporativo: 'bg-blue-500',
                                industrial: 'bg-orange-500',
                                bordados: 'bg-purple-500',
                                equipos: 'bg-green-500'
                            }
                            const labels = {
                                corporativo: 'Corporativo',
                                industrial: 'Industrial',
                                bordados: 'Bordados',
                                equipos: 'Equipos'
                            }
                            return (
                                <div key={type}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium">{labels[type]}</span>
                                        <span className="text-sm font-bold text-primary">{count} productos ({percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`${colors[type]} h-3 rounded-full transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Estado Activo/Inactivo */}
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
                        <Icon name="toggle_on" />
                        Estado de Productos
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Activos</span>
                                <span className="text-sm font-bold text-green-600">{activePercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-green-500 h-3 rounded-full" style={{ width: `${activePercentage}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Inactivos</span>
                                <span className="text-sm font-bold text-red-600">{100 - activePercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-red-500 h-3 rounded-full" style={{ width: `${100 - activePercentage}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estadísticas adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#FC9430]/10 rounded-full flex items-center justify-center">
                            <Icon name="star" className="text-[#FC9430] text-lg" />
                        </div>
                        <h3 className="font-bold text-primary">Productos Destacados</h3>
                    </div>
                    <p className="text-2xl font-bold">{products.filter(p => p.isFeatured).length}</p>
                    <p className="text-xs text-gray-500 mt-1">En página principal</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Icon name="fiber_new" className="text-green-600 text-lg" />
                        </div>
                        <h3 className="font-bold text-primary">Productos Nuevos</h3>
                    </div>
                    <p className="text-2xl font-bold">{products.filter(p => p.isNew).length}</p>
                    <p className="text-xs text-gray-500 mt-1">Últimos 30 días</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Icon name="local_offer" className="text-blue-600 text-lg" />
                        </div>
                        <h3 className="font-bold text-primary">En Oferta</h3>
                    </div>
                    <p className="text-2xl font-bold">{products.filter(p => p.hasDiscount).length}</p>
                    <p className="text-xs text-gray-500 mt-1">Con descuento activo</p>
                </div>
            </div>

            {/* ✅ Productos con stock bajo - tabla CON PAGINACIÓN */}
            {(totalProblemProducts > 0) && (
                <div className="bg-white border rounded-lg shadow-sm">
                    <div className="p-4 border-b bg-yellow-50 flex justify-between items-center">
                        <h3 className="font-bold text-yellow-800 flex items-center gap-2">
                            <Icon name="warning" />
                            Alertas de Inventario
                        </h3>
                        <span className="text-sm text-gray-500">
                            Mostrando {start} - {end} de {totalProblemProducts} productos con problemas
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-bold">#</th>
                                    <th className="px-4 py-3 text-left text-sm font-bold">Producto</th>
                                    <th className="px-4 py-3 text-left text-sm font-bold">Referencia</th>
                                    <th className="px-4 py-3 text-left text-sm font-bold">Stock Actual</th>
                                    <th className="px-4 py-3 text-left text-sm font-bold">Estado</th>
                                    <th className="px-4 py-3 text-left text-sm font-bold">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-gray-500">
                                            No hay productos con problemas de stock
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedProducts.map((product, index) => {
                                        const globalIndex = (currentPage - 1) * itemsPerPage + index + 1
                                        const isOutOfStock = product.stock === 0
                                        return (
                                            <tr key={product.id} className="border-t hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-400 font-mono">
                                                    {globalIndex}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium">{product.name}</div>
                                                    <div className="text-xs text-gray-500">{product.productType}</div>
                                                </td>
                                                <td className="px-4 py-3 text-sm">{product.reference}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`font-bold ${isOutOfStock ? 'text-red-600' : 'text-yellow-600'}`}>
                                                        {isOutOfStock ? 'Agotado' : `${product.stock} unidades`}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`text-sm ${isOutOfStock ? 'text-red-600' : 'text-yellow-600'}`}>
                                                        {isOutOfStock ? 'Sin stock' : 'Stock bajo'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button className="text-primary text-sm hover:text-[#FC9430] transition-colors">
                                                        Reabastecer
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ✅ Paginación */}
                    <Pagination />

                    {/* ✅ Información de paginación */}
                    {totalProblemProducts > 0 && (
                        <div className="px-4 py-3 border-t bg-gray-50 text-center text-xs text-gray-500">
                            Página {currentPage} de {totalPages} ·
                            Mostrando {paginatedProducts.length} de {totalProblemProducts} productos con problemas de stock
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}