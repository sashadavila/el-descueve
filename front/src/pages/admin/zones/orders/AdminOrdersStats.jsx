// src/pages/admin/zones/orders/AdminOrdersStats.jsx
import { useState, useEffect } from 'react'
import Icon from '../../../../components/ui/Icon'
import api from '../../../../config/api'

export default function AdminOrdersStats() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // ✅ Estado para paginación de la tabla de productos más vendidos
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true)
                const data = await api.orders.getAll()
                setOrders(data)
            } catch (err) {
                console.error('Error fetching orders stats:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    // Calcular estadísticas
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0)
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    const ordersByStatus = {
        PENDING: orders.filter(o => o.status === 'PENDING').length,
        PAID: orders.filter(o => o.status === 'PAID').length,
        CANCELLED: orders.filter(o => o.status === 'CANCELLED').length,
        DELIVERED: orders.filter(o => o.status === 'DELIVERED').length
    }

    // ✅ Calcular productos más vendidos
    const getTopProducts = () => {
        const productSales = {}
        orders.forEach(order => {
            order.items?.forEach(item => {
                const productId = item.productId
                const productName = item.product?.name || 'Producto'
                const productRef = item.product?.reference || 'N/A'
                if (!productSales[productId]) {
                    productSales[productId] = {
                        id: productId,
                        name: productName,
                        reference: productRef,
                        quantity: 0,
                        revenue: 0
                    }
                }
                productSales[productId].quantity += item.quantity
                productSales[productId].revenue += parseFloat(item.subtotal) || 0
            })
        })
        return Object.values(productSales).sort((a, b) => b.quantity - a.quantity)
    }

    const topProducts = getTopProducts()
    const totalTopProducts = topProducts.length

    // ✅ Obtener productos paginados
    const getPaginatedProducts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return topProducts.slice(startIndex, endIndex)
    }

    // ✅ Calcular total de páginas
    const totalPages = Math.ceil(totalTopProducts / itemsPerPage)

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
        const end = Math.min(currentPage * itemsPerPage, totalTopProducts)
        return { start, end }
    }

    // Órdenes por mes (últimos 6 meses)
    const getOrdersByMonth = () => {
        const months = {}
        const now = new Date()

        for (let i = 0; i < 6; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthKey = date.toLocaleString('es-CL', { month: 'short', year: '2-digit' })
            months[monthKey] = { count: 0, revenue: 0 }
        }

        orders.forEach(order => {
            const createdAt = new Date(order.createdAt)
            const monthKey = createdAt.toLocaleString('es-CL', { month: 'short', year: '2-digit' })
            if (months[monthKey]) {
                months[monthKey].count++
                months[monthKey].revenue += parseFloat(order.total) || 0
            }
        })

        return Object.entries(months).reverse().map(([month, data]) => ({
            month,
            count: data.count,
            revenue: data.revenue
        }))
    }

    const monthlyData = getOrdersByMonth()
    const maxMonthlyOrders = Math.max(...monthlyData.map(d => d.count), 1)
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
                    Estadísticas de Pedidos
                </h2>
                <p className="text-on-surface-variant mt-1">Métricas y análisis de ventas</p>
            </div>

            {/* Cards principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon name="receipt_long" className="text-2xl text-primary" />
                        </div>
                        <span className="text-3xl font-bold text-primary">{totalOrders}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Total Pedidos</h3>
                    <p className="text-xs text-gray-500 mt-1">Órdenes registradas</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Icon name="attach_money" className="text-2xl text-green-600" />
                        </div>
                        <span className="text-3xl font-bold text-green-600">${Math.round(totalRevenue).toLocaleString()}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Ingresos Totales</h3>
                    <p className="text-xs text-gray-500 mt-1">Facturación acumulada</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-[#FC9430]/10 rounded-full flex items-center justify-center">
                            <Icon name="trending_up" className="text-2xl text-[#FC9430]" />
                        </div>
                        <span className="text-3xl font-bold text-[#FC9430]">${Math.round(averageOrderValue).toLocaleString()}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Ticket Promedio</h3>
                    <p className="text-xs text-gray-500 mt-1">Valor por orden</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Icon name="pending" className="text-2xl text-yellow-600" />
                        </div>
                        <span className="text-3xl font-bold text-yellow-600">{ordersByStatus.PENDING}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Pendientes</h3>
                    <p className="text-xs text-gray-500 mt-1">Por procesar</p>
                </div>
            </div>

            {/* Distribución por estado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
                        <Icon name="pie_chart" />
                        Distribución por Estado
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Pendientes</span>
                                <span className="text-sm font-bold text-yellow-600">{ordersByStatus.PENDING}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-yellow-500 h-3 rounded-full" style={{ width: `${(ordersByStatus.PENDING / totalOrders) * 100}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Pagados</span>
                                <span className="text-sm font-bold text-blue-600">{ordersByStatus.PAID}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${(ordersByStatus.PAID / totalOrders) * 100}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Cancelados</span>
                                <span className="text-sm font-bold text-red-600">{ordersByStatus.CANCELLED}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-red-500 h-3 rounded-full" style={{ width: `${(ordersByStatus.CANCELLED / totalOrders) * 100}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Entregados</span>
                                <span className="text-sm font-bold text-green-600">{ordersByStatus.DELIVERED}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-green-500 h-3 rounded-full" style={{ width: `${(ordersByStatus.DELIVERED / totalOrders) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tasa de conversión */}
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
                        <Icon name="conversion" />
                        Tasa de Conversión
                    </h3>
                    <div className="text-center">
                        <div className="relative inline-flex items-center justify-center">
                            <svg className="w-48 h-48">
                                <circle
                                    className="text-gray-200"
                                    strokeWidth="12"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="80"
                                    cx="96"
                                    cy="96"
                                />
                                <circle
                                    className="text-green-500"
                                    strokeWidth="12"
                                    strokeDasharray={`${((ordersByStatus.DELIVERED / totalOrders) * 100) * 5.02} 502`}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="80"
                                    cx="96"
                                    cy="96"
                                />
                            </svg>
                            <span className="absolute text-3xl font-bold text-primary">
                                {totalOrders > 0 ? Math.round((ordersByStatus.DELIVERED / totalOrders) * 100) : 0}%
                            </span>
                        </div>
                        <p className="mt-4 text-sm text-gray-600">
                            Pedidos entregados sobre el total
                        </p>
                    </div>
                </div>
            </div>

            {/* Evolución mensual */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
                    <Icon name="timeline" />
                    Evolución de Pedidos (últimos 6 meses)
                </h3>
                <div className="space-y-4">
                    {monthlyData.map((data) => (
                        <div key={data.month}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-600">{data.month}</span>
                                <div className="flex gap-4">
                                    <span className="text-sm font-bold text-primary">{data.count} pedidos</span>
                                    <span className="text-sm font-bold text-green-600">${Math.round(data.revenue).toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-primary to-[#FC9430] h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${(data.count / maxMonthlyOrders) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ✅ Top productos - CON PAGINACIÓN */}
            <div className="bg-white border rounded-lg shadow-sm">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-primary flex items-center gap-2">
                        <Icon name="star" />
                        Productos Más Vendidos
                    </h3>
                    <span className="text-sm text-gray-500">
                        Mostrando {start} - {end} de {totalTopProducts} productos
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-bold">#</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">Producto</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">Referencia</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">Cantidad Vendida</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">Ingresos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-500">
                                        No hay productos vendidos
                                    </td>
                                </tr>
                            ) : (
                                paginatedProducts.map((product, index) => {
                                    const globalIndex = (currentPage - 1) * itemsPerPage + index + 1
                                    return (
                                        <tr key={product.id} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-400 font-mono">
                                                {globalIndex}
                                            </td>
                                            <td className="px-4 py-3 font-medium">{product.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500">{product.reference}</td>
                                            <td className="px-4 py-3 font-bold text-primary">{product.quantity} unidades</td>
                                            <td className="px-4 py-3 text-green-600">${Math.round(product.revenue).toLocaleString()}</td>
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
                {totalTopProducts > 0 && (
                    <div className="px-4 py-3 border-t bg-gray-50 text-center text-xs text-gray-500">
                        Página {currentPage} de {totalPages} ·
                        Mostrando {paginatedProducts.length} de {totalTopProducts} productos
                    </div>
                )}
            </div>
        </div>
    )
}