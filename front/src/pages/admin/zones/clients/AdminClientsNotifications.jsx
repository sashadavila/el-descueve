// src/pages/admin/zones/clients/AdminClientsNotifications.jsx
import { useState, useEffect } from 'react'
import Icon from '../../../../components/ui/Icon'
import api from '../../../../config/api'

export default function AdminClientsNotifications() {
    const [unreadNotifications, setUnreadNotifications] = useState([])
    const [readNotifications, setReadNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [activeTab, setActiveTab] = useState('unread')
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [notificationToDelete, setNotificationToDelete] = useState(null)
    const [generateResult, setGenerateResult] = useState(null)
    const [filter, setFilter] = useState('all') // all, new_user, inactive_user, admin_user

    // Paginación
    const [unreadPage, setUnreadPage] = useState(1)
    const [readPage, setReadPage] = useState(1)
    const [unreadTotalPages, setUnreadTotalPages] = useState(1)
    const [readTotalPages, setReadTotalPages] = useState(1)
    const [unreadTotal, setUnreadTotal] = useState(0)
    const [readTotal, setReadTotal] = useState(0)

    const itemsPerPage = 10

    // Cargar notificaciones de clientes
    const loadNotifications = async () => {
        setLoading(true)
        try {
            // Cargar no leídas
            const unreadResult = await api.notifications.getAll('unread', unreadPage, itemsPerPage)
            const filteredUnread = unreadResult.data.filter(n =>
                n.type === 'new_user' || n.type === 'inactive_user' || n.type === 'admin_user'
            )
            setUnreadNotifications(filteredUnread)
            setUnreadTotalPages(Math.ceil(filteredUnread.length / itemsPerPage) || 1)
            setUnreadTotal(filteredUnread.length)

            // Cargar leídas
            const readResult = await api.notifications.getAll('read', readPage, itemsPerPage)
            const filteredRead = readResult.data.filter(n =>
                n.type === 'new_user' || n.type === 'inactive_user' || n.type === 'admin_user'
            )
            setReadNotifications(filteredRead)
            setReadTotalPages(Math.ceil(filteredRead.length / itemsPerPage) || 1)
            setReadTotal(filteredRead.length)
        } catch (error) {
            console.error('Error loading client notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    // Generar notificaciones automáticas de clientes
    const generateNotifications = async () => {
        setGenerating(true)
        setGenerateResult(null)
        try {
            const users = await api.admin.getAllUsers()
            const result = await api.notifications.generate(users)

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
            console.error('Error generating notifications:', error)
            setGenerateResult({
                success: false,
                message: error.message || 'Error al generar notificaciones'
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

    const getTypeLabel = (type) => {
        const labels = {
            new_user: 'Nuevo Registro',
            inactive_user: 'Cuenta Inactiva',
            admin_user: 'Administrador',
            new_order: 'Nuevo Pedido',
            system_alert: 'Alerta del Sistema'
        }
        return labels[type] || 'Notificación'
    }

    const getTypeIcon = (type) => {
        const icons = {
            new_user: 'person_add',
            inactive_user: 'block',
            admin_user: 'admin_panel_settings',
            new_order: 'receipt_long',
            system_alert: 'warning'
        }
        return icons[type] || 'notifications'
    }

    const getTypeColor = (type) => {
        const colors = {
            new_user: 'bg-green-100 text-green-600',
            inactive_user: 'bg-red-100 text-red-600',
            admin_user: 'bg-purple-100 text-purple-600',
            new_order: 'bg-blue-100 text-blue-600',
            system_alert: 'bg-orange-100 text-orange-600'
        }
        return colors[type] || 'bg-gray-100 text-gray-600'
    }

    const getFilteredNotifications = (notificationsList) => {
        if (filter === 'all') return notificationsList
        return notificationsList.filter(n => n.type === filter)
    }

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
                        <Icon name="notifications" className="text-4xl" />
                        Notificaciones de Clientes
                    </h2>
                    <p className="text-on-surface-variant mt-1">
                        Alertas sobre registros, estados y actividad de clientes
                    </p>
                </div>

                <div className="flex gap-3">
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
                        <p className={`text-sm ${generateResult.success ? 'text-green-700' : 'text-red-700'}`}>
                            {generateResult.message}
                        </p>
                    </div>
                </div>
            )}

            {/* Filtros por tipo */}
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
                    onClick={() => setFilter('new_user')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${filter === 'new_user'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <Icon name="person_add" className="text-sm" />
                    Nuevos Registros
                </button>
                <button
                    onClick={() => setFilter('inactive_user')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${filter === 'inactive_user'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <Icon name="block" className="text-sm" />
                    Cuentas Inactivas
                </button>
                <button
                    onClick={() => setFilter('admin_user')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${filter === 'admin_user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <Icon name="admin_panel_settings" className="text-sm" />
                    Administradores
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
                                ? 'No tienes notificaciones no leídas de clientes'
                                : 'No hay notificaciones leídas de clientes'}
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
                                    <div className={`w-10 h-10 ${getTypeColor(notification.type)} rounded-full flex items-center justify-center flex-shrink-0`}>
                                        <Icon name={getTypeIcon(notification.type)} className="text-lg" />
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
                                                    {getTypeLabel(notification.type)}
                                                </p>
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

                                        {notification.metadata && (notification.metadata.userName || notification.metadata.userEmail) && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="flex flex-wrap gap-4 text-sm">
                                                    {notification.metadata.userName && (
                                                        <div>
                                                            <span className="text-xs text-gray-400">Nombre</span>
                                                            <p className="font-medium">{notification.metadata.userName}</p>
                                                        </div>
                                                    )}
                                                    {notification.metadata.userEmail && (
                                                        <div>
                                                            <span className="text-xs text-gray-400">Email</span>
                                                            <p className="font-medium">{notification.metadata.userEmail}</p>
                                                        </div>
                                                    )}
                                                    {notification.metadata.userCompany && (
                                                        <div>
                                                            <span className="text-xs text-gray-400">Empresa</span>
                                                            <p className="font-medium">{notification.metadata.userCompany}</p>
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