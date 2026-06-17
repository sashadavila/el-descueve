// src/pages/admin/zones/shipments/AdminShipmentsStats.jsx
import { useState, useEffect } from 'react'
import Icon from '../../../../components/ui/Icon'
import api from '../../../../config/api'

export default function AdminShipmentsStats() {
    const [shipments, setShipments] = useState([])
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // ✅ Estado para paginación de la tabla de últimos envíos
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [shipmentsData, statsData] = await Promise.all([
                    api.shipments.getAll(),
                    api.shipments.getStats()
                ])
                setShipments(shipmentsData.data || [])
                setStats(statsData)
            } catch (err) {
                console.error('Error fetching shipments stats:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // Calcular estadísticas adicionales
    const totalShipments = shipments.length
    const deliveredShipments = shipments.filter(s => s.status === 'Entregado').length
    const pendingShipments = shipments.filter(s => s.status === 'Pedido Recibido' || s.status === 'En Preparación').length
    const inTransit = shipments.filter(s => s.status === 'En Tránsito').length
    const deliveryRate = totalShipments > 0 ? Math.round((deliveredShipments / totalShipments) * 100) : 0

    const ownShipments = shipments.filter(s => s.carrier === 'propio').length
    const externalShipments = shipments.filter(s => s.carrier === 'externo').length

    // Envíos por mes
    const getShipmentsByMonth = () => {
        const months = {}
        const now = new Date()

        for (let i = 0; i < 6; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthKey = date.toLocaleString('es-CL', { month: 'short', year: '2-digit' })
            months[monthKey] = 0
        }

        shipments.forEach(shipment => {
            const createdAt = new Date(shipment.createdAt)
            const monthKey = createdAt.toLocaleString('es-CL', { month: 'short', year: '2-digit' })
            if (months[monthKey] !== undefined) {
                months[monthKey]++
            }
        })

        return Object.entries(months).reverse().map(([month, count]) => ({ month, count }))
    }

    const monthlyData = getShipmentsByMonth()
    const maxMonthlyShipments = Math.max(...monthlyData.map(d => d.count), 1)

    // ✅ Obtener envíos paginados (ordenados por fecha descendente)
    const getPaginatedShipments = () => {
        // Ordenar envíos por fecha de creación (más recientes primero)
        const sortedShipments = [...shipments].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        )
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return sortedShipments.slice(startIndex, endIndex)
    }

    // ✅ Calcular total de páginas
    const totalPages = Math.ceil(totalShipments / itemsPerPage)

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
        const end = Math.min(currentPage * itemsPerPage, totalShipments)
        return { start, end }
    }

    const paginatedShipments = getPaginatedShipments()
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
                    Estadísticas de Envíos
                </h2>
                <p className="text-on-surface-variant mt-1">Métricas y análisis de despachos</p>
            </div>

            {/* Cards principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon name="local_shipping" className="text-2xl text-primary" />
                        </div>
                        <span className="text-3xl font-bold text-primary">{totalShipments}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Total Envíos</h3>
                    <p className="text-xs text-gray-500 mt-1">Despachos realizados</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Icon name="check_circle" className="text-2xl text-green-600" />
                        </div>
                        <span className="text-3xl font-bold text-green-600">{deliveredShipments}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Entregados</h3>
                    <p className="text-xs text-gray-500 mt-1">{deliveryRate}% del total</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <Icon name="sync" className="text-2xl text-orange-600" />
                        </div>
                        <span className="text-3xl font-bold text-orange-600">{inTransit}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">En Tránsito</h3>
                    <p className="text-xs text-gray-500 mt-1">En camino al destino</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Icon name="pending" className="text-2xl text-yellow-600" />
                        </div>
                        <span className="text-3xl font-bold text-yellow-600">{pendingShipments}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Pendientes</h3>
                    <p className="text-xs text-gray-500 mt-1">Por procesar</p>
                </div>
            </div>

            {/* Distribución por Transportista */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
                        <Icon name="pie_chart" />
                        Distribución por Transportista
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Envío Propio</span>
                                <span className="text-sm font-bold text-primary">{Math.round((ownShipments / totalShipments) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-primary h-3 rounded-full" style={{ width: `${(ownShipments / totalShipments) * 100}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{ownShipments} envíos</p>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Empresa Externa</span>
                                <span className="text-sm font-bold text-[#FC9430]">{Math.round((externalShipments / totalShipments) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-[#FC9430] h-3 rounded-full" style={{ width: `${(externalShipments / totalShipments) * 100}%` }}></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{externalShipments} envíos</p>
                        </div>
                    </div>
                </div>

                {/* Tasa de entrega a tiempo */}
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
                        <Icon name="schedule" />
                        Eficiencia de Entregas
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
                                    strokeDasharray={`${deliveryRate * 5.02} 502`}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="80"
                                    cx="96"
                                    cy="96"
                                />
                            </svg>
                            <span className="absolute text-3xl font-bold text-primary">
                                {deliveryRate}%
                            </span>
                        </div>
                        <p className="mt-4 text-sm text-gray-600">
                            Tasa de entregas completadas
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {stats?.averageDeliveryDays || 0} días promedio de entrega
                        </p>
                    </div>
                </div>
            </div>

            {/* Evolución mensual */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
                    <Icon name="timeline" />
                    Evolución de Envíos (últimos 6 meses)
                </h3>
                <div className="space-y-4">
                    {monthlyData.map((data) => (
                        <div key={data.month}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-600">{data.month}</span>
                                <span className="text-sm font-bold text-primary">{data.count} envíos</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-primary to-[#FC9430] h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${(data.count / maxMonthlyShipments) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Métricas adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Icon name="speed" className="text-blue-600 text-lg" />
                        </div>
                        <h3 className="font-bold text-primary">Tiempo Promedio de Entrega</h3>
                    </div>
                    <p className="text-2xl font-bold text-primary">{stats?.averageDeliveryDays || 0} días</p>
                    <p className="text-xs text-gray-500 mt-1">Desde creación hasta entrega</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <Icon name="warning" className="text-red-600 text-lg" />
                        </div>
                        <h3 className="font-bold text-primary">Envíos Atrasados</h3>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{stats?.delayedShipments || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Más allá de fecha estimada</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Icon name="trending_up" className="text-green-600 text-lg" />
                        </div>
                        <h3 className="font-bold text-primary">Envíos Recientes</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{stats?.recentShipments || 0}</p>
                    <p className="text-xs text-gray-500 mt-1">Últimos 30 días</p>
                </div>
            </div>

            {/* ✅ Últimos envíos - CON PAGINACIÓN */}
            <div className="bg-white border rounded-lg shadow-sm">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-primary flex items-center gap-2">
                        <Icon name="history" />
                        Últimos Envíos Realizados
                    </h3>
                    <span className="text-sm text-gray-500">
                        Mostrando {start} - {end} de {totalShipments} envíos
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-bold">#</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">N° Seguimiento</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">Orden</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">Estado</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">Transportista</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">Fecha Creación</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">Entrega Estimada</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedShipments.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500">
                                        No hay envíos registrados
                                    </td>
                                </tr>
                            ) : (
                                paginatedShipments.map((shipment, index) => {
                                    const globalIndex = (currentPage - 1) * itemsPerPage + index + 1
                                    return (
                                        <tr key={shipment.id} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-400 font-mono">
                                                {globalIndex}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-sm font-bold text-primary">
                                                {shipment.trackingNumber}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-sm">
                                                {shipment.orderId?.slice(-8).toUpperCase() || 'N/A'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-xs font-bold uppercase rounded text-white ${shipment.status === 'Entregado' ? 'bg-green-500' :
                                                        shipment.status === 'En Tránsito' ? 'bg-orange-500' :
                                                            shipment.status === 'En Preparación' ? 'bg-blue-500' : 'bg-yellow-500'
                                                    }`}>
                                                    {shipment.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {shipment.carrier === 'externo' ? shipment.carrierName || 'Externo' : 'Envío Propio'}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {new Date(shipment.createdAt).toLocaleDateString('es-CL')}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString('es-CL') : '—'}
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
                {totalShipments > 0 && (
                    <div className="px-4 py-3 border-t bg-gray-50 text-center text-xs text-gray-500">
                        Página {currentPage} de {totalPages} ·
                        Mostrando {paginatedShipments.length} de {totalShipments} envíos
                        {totalPages > 1 && (
                            <span className="ml-2 text-primary">
                                (Puedes navegar entre páginas usando los botones)
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}