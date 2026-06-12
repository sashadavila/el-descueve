// src/pages/admin/zones/orders/AdminOrdersNotifications.jsx
import { useState, useEffect } from 'react'
import Icon from '../../../../components/ui/Icon'
import api from '../../../../config/api'

export default function AdminOrdersNotifications() {
    const [unreadNotifications, setUnreadNotifications] = useState([])
    const [readNotifications, setReadNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [activeTab, setActiveTab] = useState('unread')
    const [filterType, setFilterType] = useState('all') // all, new, paid, delivered, cancelled
    const [generateResult, setGenerateResult] = useState(null)
    const [notificationToDelete, setNotificationToDelete] = useState(null)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    // Paginación
    const [unreadPage, setUnreadPage] = useState(1)
    const [readPage, setReadPage] = useState(1)
    const [unreadTotalPages, setUnreadTotalPages] = useState(1)
    const [readTotalPages, setReadTotalPages] = useState(1)
    const [unreadTotal, setUnreadTotal] = useState(0)
    const [readTotal, setReadTotal] = useState(0)

    const itemsPerPage = 15

    // Cargar todas las notificaciones (sin paginación del backend para filtrar correctamente)
    const loadAllNotifications = async () => {
        setLoading(true)
        try {
            // Cargar todas las notificaciones (sin paginación para obtener todas)
            const allNotifsResult = await api.notifications.getAll(null, 1, 1000)

            // Filtrar solo notificaciones de pedidos
            const allOrderNotifications = allNotifsResult.data.filter(n =>
                n.type === 'new_order' ||
                n.title?.toLowerCase().includes('pedido') ||
                n.title?.toLowerCase().includes('orden') ||
                n.title?.toLowerCase().includes('nuevo pedido') ||
                n.title?.toLowerCase().includes('pagado') ||
                n.title?.toLowerCase().includes('entregado') ||
                n.title?.toLowerCase().includes('cancelado')
            )

            // Separar por estado
            const unread = allOrderNotifications.filter(n => n.status === 'unread')
            const read = allOrderNotifications.filter(n => n.status === 'read')

            setUnreadTotal(unread.length)
            setReadTotal(read.length)
            setUnreadTotalPages(Math.ceil(unread.length / itemsPerPage) || 1)
            setReadTotalPages(Math.ceil(read.length / itemsPerPage) || 1)

            // Aplicar paginación manual
            const startUnread = (unreadPage - 1) * itemsPerPage
            const endUnread = startUnread + itemsPerPage
            const startRead = (readPage - 1) * itemsPerPage
            const endRead = startRead + itemsPerPage

            setUnreadNotifications(unread.slice(startUnread, endUnread))
            setReadNotifications(read.slice(startRead, endRead))

        } catch (error) {
            console.error('Error loading order notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    // Generar notificaciones automáticas de pedidos
    const generateNotifications = async () => {
        setGenerating(true)
        setGenerateResult(null)

        try {
            // Obtener todas las órdenes del sistema
            const orders = await api.orders.getAll()

            if (!orders || orders.length === 0) {
                setGenerateResult({
                    success: true,
                    created: 0,
                    skipped: 0,
                    cleaned: 0,
                    message: '⚠️ No hay pedidos en el sistema para generar notificaciones.'
                })
                setTimeout(() => setGenerateResult(null), 3000)
                setGenerating(false)
                return
            }

            // Llamar al endpoint de generación de notificaciones de pedidos
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/notifications/actions/generate-orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({ orders: orders }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Error al generar notificaciones')
            }

            const result = await response.json()

            setGenerateResult({
                success: true,
                created: result.created || 0,
                skipped: result.skipped || 0,
                cleaned: result.cleaned || 0,
                message: result.message || 'Notificaciones generadas correctamente'
            })

            // Recargar notificaciones
            await loadAllNotifications()

            // Actualizar contador en el header
            updateUnreadCount()

            // Limpiar mensaje después de 5 segundos
            setTimeout(() => {
                setGenerateResult(null)
            }, 5000)
        } catch (error) {
            console.error('Error generating order notifications:', error)
            setGenerateResult({
                success: false,
                message: error.message || 'Error al generar notificaciones de pedidos'
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

            // Mover la notificación de unread a read
            const movedNotification = unreadNotifications.find(n => n.id === id)
            if (movedNotification) {
                setUnreadNotifications(prev => prev.filter(n => n.id !== id))
                setUnreadTotal(prev => prev - 1)
                setReadTotal(prev => prev + 1)
                // Agregar a read (al inicio)
                setReadNotifications(prev => [movedNotification, ...prev])
                setReadTotalPages(Math.ceil((readTotal + 1) / itemsPerPage) || 1)
            }

            updateUnreadCount()
        } catch (error) {
            console.error('Error marking as read:', error)
            alert('❌ Error al marcar como leída')
        }
    }

    // Marcar todas como leídas
    const markAllAsRead = async () => {
        if (unreadTotal === 0) {
            alert('No hay notificaciones no leídas')
            return
        }

        try {
            await api.notifications.markAllAsRead()

            // Mover todas las notificaciones no leídas a leídas
            const allRead = [...unreadNotifications, ...readNotifications]
            setReadNotifications(allRead)
            setUnreadNotifications([])
            setUnreadTotal(0)
            setReadTotal(allRead.length)
            setReadTotalPages(Math.ceil(allRead.length / itemsPerPage) || 1)

            updateUnreadCount()
            alert('✅ Todas las notificaciones marcadas como leídas')
        } catch (error) {
            console.error('Error marking all as read:', error)
            alert('❌ Error al marcar todas como leídas')
        }
    }

    // Eliminar notificación
    const deleteNotification = async (id) => {
        setNotificationToDelete(id)
        setShowConfirmModal(true)
    }

    const confirmDelete = async () => {
        try {
            await api.notifications.delete(notificationToDelete)

            // Eliminar de la lista correspondiente
            if (activeTab === 'unread') {
                setUnreadNotifications(prev => prev.filter(n => n.id !== notificationToDelete))
                setUnreadTotal(prev => prev - 1)
                setUnreadTotalPages(Math.ceil((unreadTotal - 1) / itemsPerPage) || 1)
            } else {
                setReadNotifications(prev => prev.filter(n => n.id !== notificationToDelete))
                setReadTotal(prev => prev - 1)
                setReadTotalPages(Math.ceil((readTotal - 1) / itemsPerPage) || 1)
            }

            setShowConfirmModal(false)
            setNotificationToDelete(null)
            updateUnreadCount()
            alert('✅ Notificación eliminada correctamente')
        } catch (error) {
            console.error('Error deleting notification:', error)
            alert('❌ Error al eliminar notificación: ' + (error.message || 'Error desconocido'))
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

    // Cambiar página
    const handlePageChange = (newPage) => {
        if (activeTab === 'unread') {
            setUnreadPage(newPage)
        } else {
            setReadPage(newPage)
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Filtrar notificaciones por tipo
    const getFilteredNotifications = (notificationsList) => {
        if (filterType === 'all') return notificationsList

        switch (filterType) {
            case 'new':
                return notificationsList.filter(n => n.title?.includes('Nuevo pedido'))
            case 'paid':
                return notificationsList.filter(n => n.title?.includes('pagado'))
            case 'delivered':
                return notificationsList.filter(n => n.title?.includes('entregado'))
            case 'cancelled':
                return notificationsList.filter(n => n.title?.includes('cancelado'))
            default:
                return notificationsList
        }
    }

    // Recargar cuando cambian las páginas
    useEffect(() => {
        loadAllNotifications()
    }, [unreadPage, readPage])

    // Cargar al inicio
    useEffect(() => {
        loadAllNotifications()
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

    const getStatusIcon = (title) => {
        if (title?.includes('Nuevo pedido')) return 'receipt_long'
        if (title?.includes('pagado')) return 'payments'
        if (title?.includes('entregado')) return 'package_2'
        if (title?.includes('cancelado')) return 'cancel'
        return 'receipt_long'
    }

    const getStatusColor = (title) => {
        if (title?.includes('Nuevo pedido')) return 'bg-blue-100 text-blue-600'
        if (title?.includes('pagado')) return 'bg-green-100 text-green-600'
        if (title?.includes('entregado')) return 'bg-green-100 text-green-600'
        if (title?.includes('cancelado')) return 'bg-red-100 text-red-600'
        return 'bg-gray-100 text-gray-600'
    }

    // Paginación UI
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

    const currentNotifications = activeTab === 'unread'
        ? getFilteredNotifications(unreadNotifications)
        : getFilteredNotifications(readNotifications)

    const currentTotal = activeTab === 'unread' ? unreadTotal : readTotal
    const currentPage = activeTab === 'unread' ? unreadPage : readPage
    const currentTotalPages = activeTab === 'unread' ? unreadTotalPages : readTotalPages

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
                        <Icon name="receipt_long" className="text-4xl" />
                        Notificaciones de Pedidos
                    </h2>
                    <p className="text-on-surface-variant mt-1">
                        Alertas sobre nuevos pedidos, pagos y entregas
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={generateNotifications}
                        disabled={generating}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {generating ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Generando...
                            </>
                        ) : (
                            <>
                                <Icon name="refresh" className="text-sm" />
                                Generar Notificaciones
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
                                    <span className="text-green-600">✅ Nuevas: {generateResult.created}</span>
                                    <span className="text-yellow-600">⏭️ Omitidas: {generateResult.skipped}</span>
                                    <span className="text-gray-500">🗑️ Limpiadas: {generateResult.cleaned}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Filtros por tipo */}
            <div className="flex gap-3 flex-wrap">
                <button
                    onClick={() => setFilterType('all')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${filterType === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Todas
                </button>
                <button
                    onClick={() => setFilterType('new')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${filterType === 'new'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <Icon name="receipt_long" className="text-sm" />
                    Nuevos Pedidos
                </button>
                <button
                    onClick={() => setFilterType('paid')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${filterType === 'paid'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <Icon name="payments" className="text-sm" />
                    Pagados
                </button>
                <button
                    onClick={() => setFilterType('delivered')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${filterType === 'delivered'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <Icon name="package_2" className="text-sm" />
                    Entregados
                </button>
                <button
                    onClick={() => setFilterType('cancelled')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${filterType === 'cancelled'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <Icon name="cancel" className="text-sm" />
                    Cancelados
                </button>
            </div>

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
                                ? 'No hay notificaciones de pedidos no leídas'
                                : 'No hay notificaciones de pedidos leídas'}
                        </p>
                        {activeTab === 'unread' && (
                            <button
                                onClick={generateNotifications}
                                className="mt-4 inline-flex items-center gap-2 text-primary hover:text-[#FC9430] transition-colors"
                            >
                                <Icon name="refresh" className="text-sm" />
                                Generar notificaciones
                            </button>
                        )}
                    </div>
                ) : (
                    currentNotifications.map(notification => {
                        const orderIdShort = notification.metadata?.orderIdShort ||
                            notification.metadata?.orderId?.slice(-8) ||
                            notification.title?.match(/#([A-Z0-9]+)/)?.[1] || ''

                        return (
                            <div
                                key={notification.id}
                                className={`bg-white rounded-xl border transition-all hover:shadow-md ${activeTab === 'unread'
                                        ? 'border-l-4 border-l-[#FC9430] bg-gradient-to-r from-white to-orange-50/30'
                                        : 'border-outline-variant'
                                    }`}
                            >
                                <div className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-10 h-10 ${getStatusColor(notification.title)} rounded-full flex items-center justify-center flex-shrink-0`}>
                                            <Icon name={getStatusIcon(notification.title)} className="text-lg" />
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
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {formatTimeAgo(notification.createdAt)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {activeTab === 'read' && (
                                                        <button
                                                            onClick={() => deleteNotification(notification.id)}
                                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                                            title="Eliminar notificación"
                                                        >
                                                            <Icon name="delete" className="text-sm" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-gray-600 mt-2">{notification.message}</p>

                                            {notification.metadata && (notification.metadata.total !== undefined || notification.metadata.itemsCount !== undefined) && (
                                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex flex-wrap gap-4 text-sm">
                                                        {orderIdShort && (
                                                            <div>
                                                                <span className="text-xs text-gray-400">N° Pedido</span>
                                                                <p className="font-mono font-medium text-primary">{orderIdShort}</p>
                                                            </div>
                                                        )}
                                                        {notification.metadata.total !== undefined && (
                                                            <div>
                                                                <span className="text-xs text-gray-400">Monto</span>
                                                                <p className="font-medium text-[#FC9430]">${notification.metadata.total.toLocaleString()} CLP</p>
                                                            </div>
                                                        )}
                                                        {notification.metadata.itemsCount !== undefined && (
                                                            <div>
                                                                <span className="text-xs text-gray-400">Productos</span>
                                                                <p className="font-medium">{notification.metadata.itemsCount} items</p>
                                                            </div>
                                                        )}
                                                        {notification.metadata.status && (
                                                            <div>
                                                                <span className="text-xs text-gray-400">Estado</span>
                                                                <p className="font-medium">{notification.metadata.status}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {activeTab === 'unread' && (
                                                <div className="mt-3">
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="text-xs text-primary hover:text-[#FC9430] transition-colors font-medium flex items-center gap-1"
                                                    >
                                                        <Icon name="check" className="text-xs" />
                                                        Marcar como leída
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Paginación */}
            <Pagination
                currentPage={currentPage}
                totalPages={currentTotalPages}
                onPageChange={handlePageChange}
            />

            {/* Resumen */}
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600">
                    Total de notificaciones de pedidos: <strong>{unreadTotal + readTotal}</strong>
                    {unreadTotal > 0 && (
                        <span className="ml-2 text-[#FC9430]">
                            ({unreadTotal} no leídas)
                        </span>
                    )}
                </div>
                <div className="text-xs text-gray-400">
                    Mostrando {currentNotifications.length} de {currentTotal} notificaciones
                    {filterType !== 'all' && ` (filtrado por ${filterType})`}
                </div>
            </div>

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

            {/* Footer informativo */}
            <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-400">
                    <Icon name="info" className="text-xs inline mr-1" />
                    Las notificaciones se generan manualmente usando el botón "Generar Notificaciones".
                    Se crean automáticamente para pedidos nuevos, pagados, entregados y cancelados.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    <Icon name="schedule" className="text-xs inline mr-1" />
                    Las notificaciones leídas con más de <strong>30 días</strong> se eliminan automáticamente al generar nuevas notificaciones.
                </p>
            </div>
        </div>
    )
}