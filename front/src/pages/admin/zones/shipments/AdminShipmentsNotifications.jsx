// src/pages/admin/zones/shipments/AdminShipmentsNotifications.jsx
import { useState, useEffect } from 'react'
import Icon from '../../../../components/ui/Icon'
import api from '../../../../config/api'

export default function AdminShipmentsNotifications() {
    const [notifications, setNotifications] = useState([])
    const [shipments, setShipments] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [notifResult, shipmentsResponse] = await Promise.all([
                    api.notifications.getAll(null, 1, 50),
                    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/shipments`, {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
                    })
                ])

                // Filtrar notificaciones relacionadas con envíos
                const shipmentNotifs = notifResult.data.filter(n =>
                    n.title?.toLowerCase().includes('envío') ||
                    n.title?.toLowerCase().includes('despacho') ||
                    n.title?.toLowerCase().includes('entrega') ||
                    n.type === 'system_alert'
                )

                const shipmentsData = await shipmentsResponse.json()
                setNotifications(shipmentNotifs)
                setShipments(shipmentsData.data || [])
            } catch (error) {
                console.error('Error fetching shipment notifications:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // Envíos que requieren atención
    const pendingShipments = shipments.filter(s => s.status === 'Pedido Recibido' || s.status === 'En Preparación')
    const delayedShipments = shipments.filter(s => {
        if (!s.estimatedDelivery || s.status === 'Entregado') return false
        const estimatedDate = new Date(s.estimatedDelivery)
        const today = new Date()
        return estimatedDate < today
    })

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                    <Icon name="notifications" className="text-4xl" />
                    Notificaciones de Envíos
                </h2>
                <p className="text-on-surface-variant mt-1">Alertas sobre despachos y entregas</p>
            </div>

            {/* Alertas Activas */}
            {(pendingShipments.length > 0 || delayedShipments.length > 0) && (
                <div className="space-y-3">
                    <h3 className="font-bold text-primary flex items-center gap-2">
                        <Icon name="alert" className="text-[#FC9430]" />
                        Alertas Activas
                    </h3>

                    {pendingShipments.length > 0 && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Icon name="pending" className="text-yellow-600" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-yellow-800">Envíos Pendientes ({pendingShipments.length})</h4>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Hay {pendingShipments.length} envíos que requieren atención.
                                    </p>
                                    <button className="mt-2 text-xs text-yellow-700 font-bold hover:underline">
                                        Ir a Directorio de Envíos →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {delayedShipments.length > 0 && (
                        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Icon name="warning" className="text-red-600" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-red-800">Envíos Atrasados ({delayedShipments.length})</h4>
                                    <p className="text-sm text-red-700 mt-1">
                                        {delayedShipments.length} envíos superan la fecha estimada de entrega.
                                    </p>
                                    <button className="mt-2 text-xs text-red-700 font-bold hover:underline">
                                        Ver detalles →
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Historial de Notificaciones */}
            <div className="space-y-3">
                <h3 className="font-bold text-primary flex items-center gap-2">
                    <Icon name="history" />
                    Historial de Notificaciones
                </h3>

                <div className="space-y-3">
                    {notifications.length === 0 ? (
                        <div className="bg-white rounded-xl border p-12 text-center">
                            <Icon name="notifications_off" className="text-5xl text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-medium text-gray-600">No hay notificaciones</h3>
                            <p className="text-sm text-gray-400 mt-1">No hay alertas de envíos registradas</p>
                        </div>
                    ) : (
                        notifications.map(notification => (
                            <div
                                key={notification.id}
                                className="bg-white rounded-xl border border-l-4 border-l-primary transition-all hover:shadow-md"
                            >
                                <div className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Icon name="local_shipping" className="text-lg text-primary" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div>
                                                    <h4 className="font-bold text-gray-800">{notification.title}</h4>
                                                    <p className="text-xs text-gray-400 mt-0.5">Envíos</p>
                                                </div>
                                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                                    {formatTimeAgo(notification.createdAt)}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 mt-2">{notification.message}</p>

                                            {notification.metadata?.trackingNumber && (
                                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex flex-wrap gap-4 text-sm">
                                                        <div>
                                                            <span className="text-xs text-gray-400">N° Seguimiento</span>
                                                            <p className="font-mono font-medium">{notification.metadata.trackingNumber}</p>
                                                        </div>
                                                        {notification.metadata.status && (
                                                            <div>
                                                                <span className="text-xs text-gray-400">Estado</span>
                                                                <p className="font-medium">{notification.metadata.status}</p>
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
            </div>

            {/* Resumen */}
            <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">
                    Total de notificaciones de envíos: <strong>{notifications.length}</strong>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    {pendingShipments.length} envíos pendientes · {delayedShipments.length} envíos atrasados
                </p>
            </div>
        </div>
    )
}