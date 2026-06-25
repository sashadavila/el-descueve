// src/pages/admin/zones/messages/AdminMessagesNotifications.jsx
import { useState, useEffect } from 'react'
import Icon from '../../../../components/ui/Icon'
import api from '../../../../config/api'

const statusOptions = [
    { value: 'pending', label: 'Pendiente', color: 'bg-yellow-500' },
    { value: 'read', label: 'Leído', color: 'bg-blue-500' },
    { value: 'responded', label: 'Respondido', color: 'bg-green-500' },
    { value: 'archived', label: 'Archivado', color: 'bg-gray-500' },
]

export default function AdminMessagesNotifications() {
    const [unreadNotifications, setUnreadNotifications] = useState([])
    const [readNotifications, setReadNotifications] = useState([])
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('unread')
    const [filterStatus, setFilterStatus] = useState('all')
    const [generateResult, setGenerateResult] = useState(null)
    const [generating, setGenerating] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [notificationToDelete, setNotificationToDelete] = useState(null)

    // ✅ Paginación
    const [unreadPage, setUnreadPage] = useState(1)
    const [readPage, setReadPage] = useState(1)
    const [unreadTotalPages, setUnreadTotalPages] = useState(1)
    const [readTotalPages, setReadTotalPages] = useState(1)
    const [unreadTotal, setUnreadTotal] = useState(0)
    const [readTotal, setReadTotal] = useState(0)

    const itemsPerPage = 10

    // ✅ Cargar todas las notificaciones (sin paginación del backend para filtrar correctamente)
    const loadAllNotifications = async () => {
        setLoading(true)
        try {
            // Cargar todas las notificaciones
            const allNotifsResult = await api.notifications.getAll(null, 1, 1000)

            // Filtrar SOLO notificaciones de mensajes de contacto
            const allMessageNotifications = allNotifsResult.data.filter(n =>
                n.title?.toLowerCase().includes('mensaje') ||
                n.title?.toLowerCase().includes('contacto') ||
                n.title?.toLowerCase().includes('nuevo mensaje') ||
                (n.type === 'system_alert' && n.metadata?.messageId)
            )

            // Separar por estado
            const unread = allMessageNotifications.filter(n => n.status === 'unread')
            const read = allMessageNotifications.filter(n => n.status === 'read')

            setUnreadTotal(unread.length)
            setReadTotal(read.length)
            setUnreadTotalPages(Math.ceil(unread.length / itemsPerPage) || 1)
            setReadTotalPages(Math.ceil(read.length / itemsPerPage) || 1)

            // ✅ Aplicar paginación manual
            const startUnread = (unreadPage - 1) * itemsPerPage
            const endUnread = startUnread + itemsPerPage
            const startRead = (readPage - 1) * itemsPerPage
            const endRead = startRead + itemsPerPage

            setUnreadNotifications(unread.slice(startUnread, endUnread))
            setReadNotifications(read.slice(startRead, endRead))

            // Cargar mensajes para generar notificaciones
            const messagesData = await api.contact.getAll(null, 1, 100)
            setMessages(messagesData.data || [])

        } catch (error) {
            console.error('Error loading message notifications:', error)
        } finally {
            setLoading(false)
        }
    }

    // ✅ Generar notificaciones automáticas de mensajes
    const generateNotifications = async () => {
        setGenerating(true)
        setGenerateResult(null)

        try {
            let created = 0
            let skipped = 0

            // Obtener todas las notificaciones existentes
            const existingNotifsResult = await api.notifications.getAll(null, 1, 1000)
            const existingTitles = new Set(existingNotifsResult.data
                .filter(n => n.title?.toLowerCase().includes('mensaje') || n.title?.toLowerCase().includes('contacto'))
                .map(n => n.title)
            )

            // Mensajes pendientes que requieren notificaciones
            const pendingMessages = messages.filter(m => m.status === 'pending')
            const unreadMessages = messages.filter(m => m.status === 'read' && m.status !== 'responded')

            // ✅ 1. Notificaciones para mensajes pendientes
            for (const message of pendingMessages) {
                const title = `📩 Nuevo mensaje de ${message.name}`
                if (!existingTitles.has(title)) {
                    try {
                        await api.notifications.create({
                            title: title,
                            message: `Nuevo mensaje de contacto: "${message.subject}" - ${message.email}`,
                            type: 'system_alert',
                            metadata: {
                                messageId: message.id,
                                messageIdShort: message.id.slice(-8).toUpperCase(),
                                name: message.name,
                                email: message.email,
                                subject: message.subject,
                                status: message.status
                            },
                            icon: 'mail',
                            iconColor: 'text-orange-500',
                            bgColor: 'bg-orange-50',
                            status: 'unread'
                        })
                        created++
                    } catch (err) {
                        skipped++
                        console.error(`Error creando notificación para mensaje ${message.id}:`, err)
                    }
                } else {
                    skipped++
                }
            }

            // ✅ 2. Notificaciones para mensajes leídos no respondidos
            for (const message of unreadMessages) {
                const title = `👀 Mensaje leído: ${message.name}`
                if (!existingTitles.has(title)) {
                    try {
                        await api.notifications.create({
                            title: title,
                            message: `El mensaje "${message.subject}" de ${message.name} ha sido leído pero no respondido.`,
                            type: 'system_alert',
                            metadata: {
                                messageId: message.id,
                                messageIdShort: message.id.slice(-8).toUpperCase(),
                                name: message.name,
                                email: message.email,
                                subject: message.subject,
                                status: message.status
                            },
                            icon: 'visibility',
                            iconColor: 'text-blue-500',
                            bgColor: 'bg-blue-50',
                            status: 'unread'
                        })
                        created++
                    } catch (err) {
                        skipped++
                        console.error(`Error creando notificación para mensaje ${message.id}:`, err)
                    }
                } else {
                    skipped++
                }
            }

            setGenerateResult({
                success: true,
                created: created,
                skipped: skipped,
                message: `✅ Notificaciones de mensajes generadas: ${created} nuevas, ${skipped} omitidas (ya existían)`
            })

            // ✅ Recargar notificaciones y resetear a página 1
            setUnreadPage(1)
            setReadPage(1)
            await loadAllNotifications()
            updateUnreadCount()

            setTimeout(() => {
                setGenerateResult(null)
            }, 6000)

        } catch (error) {
            console.error('Error generating message notifications:', error)
            setGenerateResult({
                success: false,
                message: error.message || '❌ Error al generar notificaciones de mensajes'
            })
            setTimeout(() => {
                setGenerateResult(null)
            }, 5000)
        } finally {
            setGenerating(false)
        }
    }

    // ✅ Marcar notificación como leída
    const markAsRead = async (id) => {
        try {
            await api.notifications.markAsRead(id)

            const movedNotification = unreadNotifications.find(n => n.id === id)
            if (movedNotification) {
                setUnreadNotifications(prev => prev.filter(n => n.id !== id))
                setUnreadTotal(prev => prev - 1)
                setReadTotal(prev => prev + 1)
                setReadNotifications(prev => [movedNotification, ...prev])
                setReadTotalPages(Math.ceil((readTotal + 1) / itemsPerPage) || 1)
            }

            updateUnreadCount()
        } catch (error) {
            console.error('Error marking as read:', error)
            alert('❌ Error al marcar como leída')
        }
    }

    // ✅ Marcar todas como leídas
    const markAllAsRead = async () => {
        if (unreadTotal === 0) {
            alert('No hay notificaciones no leídas')
            return
        }

        try {
            await api.notifications.markAllAsRead()

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

    // ✅ Eliminar notificación
    const deleteNotification = async (id) => {
        setNotificationToDelete(id)
        setShowConfirmModal(true)
    }

    const confirmDelete = async () => {
        try {
            await api.notifications.delete(notificationToDelete)

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

    // ✅ Actualizar contador en el header
    const updateUnreadCount = async () => {
        try {
            const { count } = await api.notifications.getUnreadCount()
            window.dispatchEvent(new CustomEvent('unreadCountUpdate', { detail: { count } }))
        } catch (error) {
            console.error('Error updating unread count:', error)
        }
    }

    // ✅ Cambiar página
    const handlePageChange = (newPage) => {
        if (activeTab === 'unread') {
            setUnreadPage(newPage)
        } else {
            setReadPage(newPage)
        }
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // ✅ Filtrar notificaciones por estado
    const getFilteredNotifications = (notificationsList) => {
        if (filterStatus === 'all') return notificationsList

        switch (filterStatus) {
            case 'pending':
                return notificationsList.filter(n =>
                    n.title?.toLowerCase().includes('nuevo') ||
                    n.metadata?.status === 'pending'
                )
            case 'read':
                return notificationsList.filter(n =>
                    n.title?.toLowerCase().includes('leído') ||
                    n.metadata?.status === 'read'
                )
            case 'responded':
                return notificationsList.filter(n =>
                    n.title?.toLowerCase().includes('respondido') ||
                    n.metadata?.status === 'responded'
                )
            default:
                return notificationsList
        }
    }

    // ✅ Recargar cuando cambian las páginas
    useEffect(() => {
        loadAllNotifications()
    }, [unreadPage, readPage])

    // ✅ Cargar al inicio
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
        if (title?.toLowerCase().includes('nuevo')) return 'mail'
        if (title?.toLowerCase().includes('leído')) return 'visibility'
        if (title?.toLowerCase().includes('respondido')) return 'check_circle'
        return 'mail'
    }

    const getStatusColor = (title) => {
        if (title?.toLowerCase().includes('nuevo')) return 'bg-orange-100 text-orange-600'
        if (title?.toLowerCase().includes('leído')) return 'bg-blue-100 text-blue-600'
        if (title?.toLowerCase().includes('respondido')) return 'bg-green-100 text-green-600'
        return 'bg-gray-100 text-gray-600'
    }

    // ✅ Paginación UI
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
                        {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
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
                        {endPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
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

    // ✅ Calcular rango de registros mostrados
    const getDisplayRange = () => {
        const start = (currentPage - 1) * itemsPerPage + 1
        const end = Math.min(currentPage * itemsPerPage, currentTotal)
        return { start, end }
    }

    const { start, end } = getDisplayRange()

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
                        Notificaciones de Mensajes
                    </h2>
                    <p className="text-on-surface-variant mt-1">
                        Alertas sobre nuevos mensajes de contacto
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
                                    <span className="text-green-600">✅ Nuevas: {generateResult.created || 0}</span>
                                    <span className="text-yellow-600">⏭️ Omitidas: {generateResult.skipped || 0}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Filtros por estado */}
            <div className="flex gap-3 flex-wrap">
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${filterStatus === 'all'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Todas
                </button>
                <button
                    onClick={() => setFilterStatus('pending')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${filterStatus === 'pending'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <Icon name="mail" className="text-sm" />
                    Nuevos Mensajes
                </button>
                <button
                    onClick={() => setFilterStatus('read')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${filterStatus === 'read'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <Icon name="visibility" className="text-sm" />
                    Leídos
                </button>
                <button
                    onClick={() => setFilterStatus('responded')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 ${filterStatus === 'responded'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <Icon name="check_circle" className="text-sm" />
                    Respondidos
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
                                ? 'No hay notificaciones de mensajes no leídas'
                                : 'No hay notificaciones de mensajes leídas'}
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
                        const messageIdShort = notification.metadata?.messageIdShort ||
                            notification.metadata?.messageId?.slice(-8) || ''

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

                                            {/* Mostrar metadata si existe */}
                                            {(messageIdShort || notification.metadata?.name) && (
                                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex flex-wrap gap-4 text-sm">
                                                        {messageIdShort && (
                                                            <div>
                                                                <span className="text-xs text-gray-400">ID Mensaje</span>
                                                                <p className="font-mono font-medium text-primary">{messageIdShort}</p>
                                                            </div>
                                                        )}
                                                        {notification.metadata?.name && (
                                                            <div>
                                                                <span className="text-xs text-gray-400">Remitente</span>
                                                                <p className="font-medium">{notification.metadata.name}</p>
                                                            </div>
                                                        )}
                                                        {notification.metadata?.email && (
                                                            <div>
                                                                <span className="text-xs text-gray-400">Email</span>
                                                                <p className="font-medium">{notification.metadata.email}</p>
                                                            </div>
                                                        )}
                                                        {notification.metadata?.subject && (
                                                            <div>
                                                                <span className="text-xs text-gray-400">Asunto</span>
                                                                <p className="font-medium">{notification.metadata.subject}</p>
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

            {/* ✅ Paginación */}
            <Pagination
                currentPage={currentPage}
                totalPages={currentTotalPages}
                onPageChange={handlePageChange}
            />

            {/* ✅ Información de paginación */}
            {currentTotal > 0 && (
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                        Mostrando {start} - {end} de {currentTotal} notificaciones
                        {filterStatus !== 'all' && (
                            <span className="ml-2 text-primary">
                                (filtrado por {filterStatus === 'pending' ? 'Nuevos Mensajes' :
                                    filterStatus === 'read' ? 'Leídos' :
                                        filterStatus === 'responded' ? 'Respondidos' : 'Todos'})
                            </span>
                        )}
                    </div>
                    <div className="text-xs text-gray-400">
                        Página {currentPage} de {currentTotalPages}
                    </div>
                </div>
            )}

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
                    Se crean para mensajes nuevos y leídos no respondidos.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    <Icon name="schedule" className="text-xs inline mr-1" />
                    Las notificaciones leídas con más de <strong>30 días</strong> se eliminan automáticamente al generar nuevas notificaciones.
                </p>
            </div>
        </div>
    )
}