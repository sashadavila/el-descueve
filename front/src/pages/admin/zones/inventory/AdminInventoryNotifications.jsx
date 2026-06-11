// src/pages/admin/zones/inventory/AdminInventoryNotifications.jsx
import { useState, useEffect } from 'react'
import Icon from '../../../../components/ui/Icon'
import api from '../../../../config/api'

export default function AdminInventoryNotifications() {
    const [notifications, setNotifications] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAlertSettings, setShowAlertSettings] = useState(false)
    const [alertThreshold, setAlertThreshold] = useState(10)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [notifResult, productsData] = await Promise.all([
                    api.notifications.getAll(null, 1, 50),
                    api.products.getAll(1, 100)
                ])

                // Filtrar notificaciones del sistema relacionadas con inventario
                const inventoryNotifs = notifResult.data.filter(n =>
                    n.type === 'system_alert' || n.title?.toLowerCase().includes('stock') || n.title?.toLowerCase().includes('producto')
                )
                setNotifications(inventoryNotifs)
                setProducts(productsData.data || [])
            } catch (error) {
                console.error('Error fetching inventory notifications:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // Generar alertas de stock bajo automáticas
    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < alertThreshold)
    const outOfStockProducts = products.filter(p => p.stock === 0)

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                        <Icon name="notifications" className="text-4xl" />
                        Notificaciones de Inventario
                    </h2>
                    <p className="text-on-surface-variant mt-1">Alertas sobre stock y productos</p>
                </div>
                <button
                    onClick={() => setShowAlertSettings(true)}
                    className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-2"
                >
                    <Icon name="settings" className="text-sm" />
                    Configurar Alertas
                </button>
            </div>

            {/* Alertas Activas de Stock */}
            {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
                <div className="space-y-3">
                    <h3 className="font-bold text-primary flex items-center gap-2">
                        <Icon name="warning" className="text-[#FC9430]" />
                        Alertas Activas de Stock
                    </h3>

                    {lowStockProducts.length > 0 && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Icon name="warning" className="text-yellow-600" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-yellow-800">Stock Bajo ({lowStockProducts.length} productos)</h4>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Los siguientes productos tienen menos de {alertThreshold} unidades en inventario:
                                    </p>
                                    <ul className="mt-2 space-y-1">
                                        {lowStockProducts.slice(0, 5).map(p => (
                                            <li key={p.id} className="text-sm text-yellow-700 flex justify-between">
                                                <span>{p.name}</span>
                                                <span className="font-bold">{p.stock} unidades</span>
                                            </li>
                                        ))}
                                        {lowStockProducts.length > 5 && (
                                            <li className="text-xs text-yellow-600 mt-1">
                                                ... y {lowStockProducts.length - 5} productos más
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {outOfStockProducts.length > 0 && (
                        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Icon name="error" className="text-red-600" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-red-800">Productos Agotados ({outOfStockProducts.length})</h4>
                                    <p className="text-sm text-red-700 mt-1">Estos productos están sin stock:</p>
                                    <ul className="mt-2 space-y-1">
                                        {outOfStockProducts.slice(0, 5).map(p => (
                                            <li key={p.id} className="text-sm text-red-700 flex justify-between">
                                                <span>{p.name}</span>
                                                <span className="font-bold">Agotado</span>
                                            </li>
                                        ))}
                                        {outOfStockProducts.length > 5 && (
                                            <li className="text-xs text-red-600 mt-1">
                                                ... y {outOfStockProducts.length - 5} productos más
                                            </li>
                                        )}
                                    </ul>
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
                            <p className="text-sm text-gray-400 mt-1">No hay alertas de inventario registradas</p>
                        </div>
                    ) : (
                        notifications.map(notification => (
                            <div
                                key={notification.id}
                                className="bg-white rounded-xl border border-l-4 border-l-blue-500 transition-all hover:shadow-md"
                            >
                                <div className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Icon name="inventory_2" className="text-lg text-blue-600" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div>
                                                    <h4 className="font-bold text-gray-800">{notification.title}</h4>
                                                    <p className="text-xs text-gray-400 mt-0.5">Sistema</p>
                                                </div>
                                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                                    {formatTimeAgo(notification.createdAt)}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 mt-2">{notification.message}</p>

                                            {notification.metadata?.productName && (
                                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex flex-wrap gap-4 text-sm">
                                                        <div>
                                                            <span className="text-xs text-gray-400">Producto</span>
                                                            <p className="font-medium">{notification.metadata.productName}</p>
                                                        </div>
                                                        {notification.metadata.productReference && (
                                                            <div>
                                                                <span className="text-xs text-gray-400">Referencia</span>
                                                                <p className="font-medium">{notification.metadata.productReference}</p>
                                                            </div>
                                                        )}
                                                        {notification.metadata.stock !== undefined && (
                                                            <div>
                                                                <span className="text-xs text-gray-400">Stock Actual</span>
                                                                <p className="font-medium text-red-600">{notification.metadata.stock} unidades</p>
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
                    Total de notificaciones: <strong>{notifications.length}</strong>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    Alertas activas: {lowStockProducts.length + outOfStockProducts.length} productos con problemas de stock
                </p>
            </div>

            {/* Modal Configuración Alertas */}
            {showAlertSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-primary">Configurar Alertas de Stock</h3>
                            <button onClick={() => setShowAlertSettings(false)} className="text-gray-400 hover:text-gray-600">
                                <Icon name="close" className="text-2xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Umbral de Stock Bajo
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="50"
                                        value={alertThreshold}
                                        onChange={(e) => setAlertThreshold(parseInt(e.target.value))}
                                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <span className="text-lg font-bold text-primary min-w-[50px] text-right">
                                        {alertThreshold}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Productos con stock menor a {alertThreshold} unidades mostrarán alerta
                                </p>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg mb-4">
                                <p className="text-sm text-blue-700">
                                    <strong>Umbral actual:</strong> {alertThreshold} unidades
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Productos con stock bajo actualmente: {lowStockProducts.length}
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowAlertSettings(false)}
                                    className="flex-1 px-4 py-2 border rounded-lg font-medium"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => {
                                        localStorage.setItem('stock_alert_threshold', alertThreshold)
                                        setShowAlertSettings(false)
                                        alert('✅ Configuración guardada')
                                    }}
                                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-medium"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}