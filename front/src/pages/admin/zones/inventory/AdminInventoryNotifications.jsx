// src/pages/admin/zones/inventory/AdminInventoryNotifications.jsx
import { useState, useEffect } from 'react'
import Icon from '../../../../components/ui/Icon'
import api from '../../../../config/api'

export default function AdminInventoryNotifications() {
    const [unreadNotifications, setUnreadNotifications] = useState([])
    const [readNotifications, setReadNotifications] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [activeTab, setActiveTab] = useState('unread')
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [notificationToDelete, setNotificationToDelete] = useState(null)
    const [generateResult, setGenerateResult] = useState(null)
    const [alertThreshold, setAlertThreshold] = useState(10)
    const [showAlertSettings, setShowAlertSettings] = useState(false)

    // Paginación
    const [unreadPage, setUnreadPage] = useState(1)
    const [readPage, setReadPage] = useState(1)
    const [unreadTotalPages, setUnreadTotalPages] = useState(1)
    const [readTotalPages, setReadTotalPages] = useState(1)
    const [unreadTotal, setUnreadTotal] = useState(0)
    const [readTotal, setReadTotal] = useState(0)

    const itemsPerPage = 10

    // Cargar notificaciones y productos
    const loadNotifications = async () => {
        setLoading(true)
        try {
            const [unreadResult, readResult, productsData] = await Promise.all([
                api.notifications.getAll('unread', unreadPage, itemsPerPage),
                api.notifications.getAll('read', readPage, itemsPerPage),
                api.products.getAll(1, 100)
            ])

            // Filtrar notificaciones de inventario (system_alert o relacionadas con stock)
            const filteredUnread = unreadResult.data.filter(n =>
                n.type === 'system_alert' ||
                n.title?.toLowerCase().includes('stock') ||
                n.title?.toLowerCase().includes('producto') ||
                n.title?.toLowerCase().includes('inventario')
            )
            const filteredRead = readResult.data.filter(n =>
                n.type === 'system_alert' ||
                n.title?.toLowerCase().includes('stock') ||
                n.title?.toLowerCase().includes('producto') ||
                n.title?.toLowerCase().includes('inventario')
            )

            setUnreadNotifications(filteredUnread)
            setReadNotifications(filteredRead)
            setUnreadTotalPages(Math.ceil(filteredUnread.length / itemsPerPage) || 1)
            setReadTotalPages(Math.ceil(filteredRead.length / itemsPerPage) || 1)
            setUnreadTotal(filteredUnread.length)
            setReadTotal(filteredRead.length)
            setProducts(productsData.data || [])
        } catch (error) {
            console.error('Error loading inventory notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    // Generar notificaciones automáticas de inventario (stock bajo y agotados)
    const generateNotifications = async () => {
        setGenerating(true)
        setGenerateResult(null)

        try {
            // Obtener productos actuales
            const productsData = await api.products.getAll(1, 1000)
            const products = productsData.data || []

            // Llamar al nuevo endpoint de inventario
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/notifications/actions/generate-inventory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({
                    products: products,
                    threshold: alertThreshold
                }),
            })

            if (!response.ok) {
                throw new Error('Error al generar notificaciones')
            }

            const result = await response.json()

            setGenerateResult({
                success: true,
                created: result.created,
                skipped: result.skipped,
                cleaned: result.cleaned,
                message: result.message
            })

            await loadNotifications()

            setTimeout(() => {
                setGenerateResult(null)
            }, 5000)
        } catch (error) {
            console.error('Error generating inventory notifications:', error)
            setGenerateResult({
                success: false,
                message: error.message || 'Error al generar notificaciones de inventario'
            })
            setTimeout(() => {
                setGenerateResult(null)
            }, 5000)
        } finally {
            setGenerating(false)
        }
    }

    // Marcar notificación como leída
    const markAsRead = async (id) => {
        try {
            await api.notifications.markAsRead(id)
            const movedNotification = unreadNotifications.find(n => n.id === id)
            if (movedNotification) {
                setUnreadNotifications(prev => prev.filter(n => n.id !== id))
                setReadNotifications(prev => [movedNotification, ...prev])
                setUnreadTotal(prev => prev - 1)
                setReadTotal(prev => prev + 1)
            }
            await loadNotifications()
            updateUnreadCount()
        } catch (error) {
            console.error('Error marking as read:', error)
            alert('❌ Error al marcar como leída')
        }
    }

    // Marcar todas como leídas
    const markAllAsRead = async () => {
        try {
            await api.notifications.markAllAsRead()
            await loadNotifications()
            updateUnreadCount()
            alert('✅ Todas las notificaciones marcadas como leídas')
        } catch (error) {
            console.error('Error marking all as read:', error)
            alert('❌ Error al marcar todas como leídas')
        }
    }

    // Eliminar notificación (solo si está leída)
    const deleteNotification = async (id, isUnread) => {
        if (isUnread) {
            alert('❌ No se pueden eliminar notificaciones no leídas. Primero debe marcarlas como leídas.')
            return
        }

        setNotificationToDelete({ id, isUnread })
        setShowConfirmModal(true)
    }

    // Confirmar eliminación
    const confirmDelete = async () => {
        const { id, isUnread } = notificationToDelete
        try {
            await api.notifications.delete(id)
            if (isUnread) {
                setUnreadNotifications(prev => prev.filter(n => n.id !== id))
                setUnreadTotal(prev => prev - 1)
            } else {
                setReadNotifications(prev => prev.filter(n => n.id !== id))
                setReadTotal(prev => prev - 1)
            }
            alert('✅ Notificación eliminada correctamente')
            updateUnreadCount()
        } catch (error) {
            console.error('Error deleting notification:', error)
            alert('❌ ' + (error.message || 'Error al eliminar notificación'))
        } finally {
            setShowConfirmModal(false)
            setNotificationToDelete(null)
        }
    }

    // Actualizar contador en el header
    const updateUnreadCount = async () => {
        try {
            const { count } = await api.notifications.getUnreadCount()
            window.dispatchEvent(new CustomEvent('unreadCountUpdate', { detail: { count } }))
        } catch (error) {
            console.error('Error updating unread count:', error)
        }
    }

    // Recargar cuando cambian las páginas
    useEffect(() => {
        loadNotifications()
    }, [unreadPage, readPage])

    // Cargar umbral de alerta guardado
    useEffect(() => {
        const savedThreshold = localStorage.getItem('stock_alert_threshold')
        if (savedThreshold) {
            setAlertThreshold(parseInt(savedThreshold))
        }
    }, [])

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

    // Productos con problemas de stock
    const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < alertThreshold)
    const outOfStockProducts = products.filter(p => p.stock === 0)

    const Pagination = ({ currentPage, totalPages, onPageChange }) => {
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
            <div className="flex justify-center items-center gap-2 mt-6">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    Anterior
                </button>

                {startPage > 1 && (
                    <>
                        <button onClick={() => onPageChange(1)} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition-colors">1</button>
                        {startPage > 2 && <span className="px-2">...</span>}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
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
                        {endPage < totalPages - 1 && <span className="px-2">...</span>}
                        <button onClick={() => onPageChange(totalPages)} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition-colors">
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    Siguiente
                </button>
            </div>
        )
    }

    const currentNotifications = activeTab === 'unread' ? unreadNotifications : readNotifications
    const currentPage = activeTab === 'unread' ? unreadPage : readPage
    const currentTotalPages = activeTab === 'unread' ? unreadTotalPages : readTotalPages

    const handlePageChange = (newPage) => {
        if (activeTab === 'unread') {
            setUnreadPage(newPage)
        } else {
            setReadPage(newPage)
        }
    }

    if (loading && unreadNotifications.length === 0 && readNotifications.length === 0) {
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
                        <Icon name="inventory_2" className="text-4xl" />
                        Notificaciones de Inventario
                    </h2>
                    <p className="text-on-surface-variant mt-1">Alertas sobre stock y productos</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAlertSettings(true)}
                        className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-2"
                    >
                        <Icon name="settings" className="text-sm" />
                        Configurar Alertas
                    </button>
                    <button
                        onClick={generateNotifications}
                        disabled={generating}
                        className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {generating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                Generando...
                            </>
                        ) : (
                            <>
                                <Icon name="refresh" className="text-sm" />
                                Regenerar Notificaciones
                            </>
                        )}
                    </button>
                    <button
                        onClick={markAllAsRead}
                        disabled={unreadTotal === 0}
                        className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Marcar todas como leídas
                    </button>
                </div>
            </div>

            {/* Resultado de generación */}
            {generateResult && (
                <div className={`p-4 rounded-lg ${generateResult.success ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
                    <div className="flex items-center gap-2">
                        <Icon name={generateResult.success ? 'check_circle' : 'error'}
                            className={generateResult.success ? 'text-green-500' : 'text-red-500'} />
                        <div className="flex-1">
                            <p className={`text-sm ${generateResult.success ? 'text-green-700' : 'text-red-700'}`}>
                                {generateResult.message}
                            </p>
                            {generateResult.success && (
                                <div className="flex gap-4 mt-2 text-xs">
                                    <span className="text-green-600">✅ Nuevas: {generateResult.created || 0}</span>
                                    <span className="text-blue-600">🔄 Actualizadas: {generateResult.updated || 0}</span>
                                    <span className="text-yellow-600">⏭️ Omitidas: {generateResult.skipped || 0}</span>
                                    <span className="text-gray-500">🗑️ Limpiadas: {generateResult.cleaned || 0}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
                                        Productos con menos de {alertThreshold} unidades:
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
                                    <ul className="mt-2 space-y-1">
                                        {outOfStockProducts.slice(0, 5).map(p => (
                                            <li key={p.id} className="text-sm text-red-700">{p.name}</li>
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

            {/* Tabs */}
            <div className="flex gap-2 border-b border-outline-variant">
                <button
                    onClick={() => setActiveTab('unread')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'unread'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    No leídas ({unreadTotal})
                </button>
                <button
                    onClick={() => setActiveTab('read')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'read'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Leídas ({readTotal})
                </button>
            </div>

            {/* Lista de notificaciones */}
            <div className="space-y-3">
                {currentNotifications.length === 0 ? (
                    <div className="bg-white rounded-xl border p-12 text-center">
                        <Icon name="notifications_off" className="text-5xl text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-600">No hay notificaciones</h3>
                        <p className="text-sm text-gray-400 mt-1">
                            {activeTab === 'unread'
                                ? 'No hay alertas de inventario no leídas'
                                : 'No hay alertas de inventario leídas'}
                        </p>
                    </div>
                ) : (
                    currentNotifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`bg-white rounded-xl border transition-all hover:shadow-md ${activeTab === 'unread'
                                ? 'border-l-4 border-l-[#FC9430] bg-gradient-to-r from-white to-orange-50/30'
                                : 'border-outline-variant'
                                }`}
                        >
                            <div className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 ${notification.bgColor || 'bg-gray-100'} rounded-full flex items-center justify-center flex-shrink-0`}>
                                        <Icon name={notification.icon || 'inventory_2'} className={`text-lg ${notification.iconColor || 'text-gray-500'}`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div>
                                                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                                    {notification.title}
                                                    {activeTab === 'unread' && (
                                                        <span className="w-2 h-2 bg-[#FC9430] rounded-full"></span>
                                                    )}
                                                </h4>
                                                <p className="text-xs text-gray-400 mt-0.5">Sistema</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                                    {formatTimeAgo(notification.createdAt)}
                                                </span>
                                                {activeTab === 'read' && (
                                                    <button
                                                        onClick={() => deleteNotification(notification.id, activeTab === 'unread')}
                                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                                        title="Eliminar notificación"
                                                    >
                                                        <Icon name="delete" className="text-sm" />
                                                    </button>
                                                )}
                                            </div>
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
                                                            <p className={`font-medium ${notification.metadata.stock === 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                                                                {notification.metadata.stock === 0 ? 'Agotado' : `${notification.metadata.stock} unidades`}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-3">
                                            {activeTab === 'unread' && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="text-xs text-primary hover:text-[#FC9430] transition-colors font-medium flex items-center gap-1"
                                                >
                                                    <Icon name="check" className="text-xs" />
                                                    Marcar como leída
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Paginación */}
            <Pagination
                currentPage={currentPage}
                totalPages={currentTotalPages}
                onPageChange={handlePageChange}
            />

            {/* Modal de confirmación para eliminar */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon name="warning" className="text-3xl text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Confirmar eliminación</h3>
                            <p className="text-gray-600 mb-6">
                                ¿Estás seguro de que deseas eliminar esta notificación?
                                Esta acción no se puede deshacer.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                    <strong>Estado actual:</strong> {lowStockProducts.length} productos con stock bajo
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowAlertSettings(false)}
                                    className="flex-1 px-4 py-2 border rounded-lg font-medium"
                                >
                                    Cancelar
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

            {/* Footer informativo */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-400">
                    <Icon name="info" className="text-xs inline mr-1" />
                    Las notificaciones <strong>no leídas</strong> no se pueden eliminar. Primero debe marcarlas como leídas.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    <Icon name="schedule" className="text-xs inline mr-1" />
                    Las notificaciones leídas con más de <strong>30 días</strong> se eliminan automáticamente al hacer clic en "Regenerar Notificaciones".
                </p>
            </div>
        </div>
    )
}