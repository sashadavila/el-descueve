// src/pages/admin/zones/orders/AdminOrdersNotifications.jsx
import { useState, useEffect } from 'react'
import Icon from '../../../../components/ui/Icon'
import api from '../../../../config/api'

export default function AdminOrdersNotifications() {
    const [notifications, setNotifications] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all, pending, paid, delivered, cancelled

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [notifResult, ordersData] = await Promise.all([
                    api.notifications.getAll(null, 1, 50),
                    api.orders.getAll()
                ])

                // Filtrar notificaciones relacionadas con pedidos
                const orderNotifs = notifResult.data.filter(n =>
                    n.type === 'new_order' || n.title?.toLowerCase().includes('pedido') || n.title?.toLowerCase().includes('orden')
                )
                setNotifications(orderNotifs)
                setOrders(ordersData)
            } catch (error) {
                console.error('Error fetching order notifications:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // Órdenes pendientes de atención
    const pendingOrders = orders.filter(o => o.status === 'PENDING')
    const paidOrders = orders.filter(o => o.status === 'PAID')

    const formatTimeAgo = (timestamp) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffMs = now - date
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return 'Hace un momento'
        if (diffMins < 60) return `Hace ${diffMins} min`
        if (diffHours < 24) return `Hace ${diffHours} horas`
        return `Hace ${diffDays} días`
    }

    const getFilteredNotifications = () => {
        if (filter === 'all') return notifications
        return notifications.filter(n => {
            if (filter === 'pending' && n.title?.toLowerCase().includes('pendiente')) return true
            if (filter === 'paid' && n.title?.toLowerCase().includes('pagado')) return true
            if (filter === 'delivered' && n.title?.toLowerCase().includes('entregado')) return true
            if (filter === 'cancelled' && n.title?.toLowerCase().includes('cancelado')) return true
            return false
        })
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    const filteredNotifications = getFilteredNotifications()

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                    <Icon name="notifications" className="text-4xl" />
                    Notificaciones de Pedidos
                </h2>
                <p className="text-on-surface-variant mt-1">Alertas sobre nuevas órdenes y cambios de estado</p>
            </div>

            {/* Alertas Activas */}
            {(pendingOrders.length > 0 || paidOrders.length > 0) && (
                <div className="space-y-3">
                    <h3 className="font-bold text-primary flex items-center gap-2">
                        <Icon name="alert" className="text-[#FC9430]" />
                        Alertas Activas
                    </h3>

                    {pendingOrders.length > 0 && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Icon name="pending" className="text-yellow-600" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-yellow-800">Pedidos Pendientes ({pendingOrders.length})</h4>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Hay {pendingOrders.length} pedidos esperando ser procesados.
                                    </p>
                                    <button className="mt-2 text-xs text-yellow-700 font-bold hover:underline">
                                        Ir a Directorio de Pedidos →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {paidOrders.length > 0 && (
                        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Icon name="paid" className="text-blue-600" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-blue-800">Pedidos Pagados ({paidOrders.length})</h4>
                                    <p className="text-sm text-blue-700 mt-1">
                                        {paidOrders.length} pedidos están pagados y listos para preparar.
                                    </p>
                                    <button className="mt-2 text-xs text-blue-700 font-bold hover:underline">
                                        Ir a Directorio de Pedidos →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Filtros */}
            <div className="flex gap-3 flex-wrap">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${filter === 'all'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Todas
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${filter === 'pending'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Pendientes
                </button>
                <button
                    onClick={() => setFilter('paid')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${filter === 'paid'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Pagados
                </button>
                <button
                    onClick={() => setFilter('delivered')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${filter === 'delivered'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Entregados
                </button>
                <button
                    onClick={() => setFilter('cancelled')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${filter === 'cancelled'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Cancelados
                </button>
            </div>

            {/* Lista de notificaciones */}
            <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                    <div className="bg-white rounded-xl border p-12 text-center">
                        <Icon name="notifications_off" className="text-5xl text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-600">No hay notificaciones</h3>
                        <p className="text-sm text-gray-400 mt-1">No hay alertas de pedidos para mostrar</p>
                    </div>
                ) : (
                    filteredNotifications.map(notification => (
                        <div
                            key={notification.id}
                            className="bg-white rounded-xl border border-l-4 border-l-primary transition-all hover:shadow-md"
                        >
                            <div className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Icon name="receipt_long" className="text-lg text-primary" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div>
                                                <h4 className="font-bold text-gray-800">{notification.title}</h4>
                                                <p className="text-xs text-gray-400 mt-0.5">Pedidos</p>
                                            </div>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {formatTimeAgo(notification.createdAt)}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 mt-2">{notification.message}</p>

                                        {notification.metadata?.orderId && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="flex flex-wrap gap-4 text-sm">
                                                    <div>
                                                        <span className="text-xs text-gray-400">N° Orden</span>
                                                        <p className="font-mono font-medium">{notification.metadata.orderId.slice(-8).toUpperCase()}</p>
                                                    </div>
                                                    {notification.metadata.total && (
                                                        <div>
                                                            <span className="text-xs text-gray-400">Monto</span>
                                                            <p className="font-medium text-primary">${notification.metadata.total.toLocaleString()}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Resumen */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">
                    Total de notificaciones de pedidos: <strong>{notifications.length}</strong>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    {pendingOrders.length} pedidos pendientes · {paidOrders.length} pedidos pagados
                </p>
            </div>
        </div>
    )
}