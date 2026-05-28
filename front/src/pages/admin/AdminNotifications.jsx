import { useState, useEffect } from 'react'
import Icon from '../../components/ui/Icon'
import api from '../../config/api'

export default function AdminNotifications() {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all, unread, read

    // Simular notificaciones (conecta con API real después)
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true)
            try {
                // Obtener usuarios para generar notificaciones
                const users = await api.admin.getAllUsers()

                // Generar notificaciones basadas en actividad reciente
                const now = new Date()
                const notificationsList = []

                // Notificaciones de nuevos usuarios (últimos 7 días)
                const recentUsers = users.filter(user => {
                    const createdAt = new Date(user.createdAt)
                    const daysDiff = (now - createdAt) / (1000 * 60 * 60 * 24)
                    return daysDiff <= 7
                })

                recentUsers.forEach(user => {
                    notificationsList.push({
                        id: `new-user-${user.id}`,
                        type: 'new_user',
                        title: 'Nuevo usuario registrado',
                        message: `${user.name} se ha registrado en la plataforma`,
                        user: user,
                        timestamp: user.createdAt,
                        read: false,
                        icon: 'person_add',
                        iconColor: 'text-green-500',
                        bgColor: 'bg-green-50'
                    })
                })

                // Notificaciones de usuarios inactivos (para revisión)
                const inactiveUsers = users.filter(user => !user.isActive)
                inactiveUsers.forEach(user => {
                    notificationsList.push({
                        id: `inactive-user-${user.id}`,
                        type: 'inactive_user',
                        title: 'Cuenta desactivada',
                        message: `La cuenta de ${user.name} está actualmente desactivada`,
                        user: user,
                        timestamp: user.updatedAt,
                        read: false,
                        icon: 'block',
                        iconColor: 'text-red-500',
                        bgColor: 'bg-red-50'
                    })
                })

                // Notificaciones de usuarios con rol admin (solo informativo)
                const adminUsers = users.filter(user => user.role === 'admin')
                adminUsers.forEach(user => {
                    if (user.email !== 'admin@eldescuevee.cl') { // Excluir admin principal
                        notificationsList.push({
                            id: `admin-user-${user.id}`,
                            type: 'admin_user',
                            title: 'Administrador en el sistema',
                            message: `${user.name} tiene permisos de administrador`,
                            user: user,
                            timestamp: user.updatedAt,
                            read: false,
                            icon: 'admin_panel_settings',
                            iconColor: 'text-purple-500',
                            bgColor: 'bg-purple-50'
                        })
                    }
                })

                // Ordenar por fecha más reciente
                notificationsList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

                setNotifications(notificationsList)
            } catch (error) {
                console.error('Error fetching notifications:', error)
                // Datos de ejemplo si falla la API
                setNotifications([
                    {
                        id: '1',
                        type: 'info',
                        title: 'Bienvenido al panel',
                        message: 'Este es el centro de notificaciones. Aquí verás actividades importantes.',
                        timestamp: new Date().toISOString(),
                        read: false,
                        icon: 'info',
                        iconColor: 'text-blue-500',
                        bgColor: 'bg-blue-50'
                    }
                ])
            } finally {
                setLoading(false)
            }
        }

        fetchNotifications()

        // Simular notificaciones en tiempo real cada 30 segundos (opcional)
        const interval = setInterval(() => {
            // Aquí podrías hacer polling a un endpoint de notificaciones
            // fetchNotifications()
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, read: true } : notif
            )
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, read: true }))
        )
    }

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id))
    }

    const getFilteredNotifications = () => {
        if (filter === 'unread') return notifications.filter(n => !n.read)
        if (filter === 'read') return notifications.filter(n => n.read)
        return notifications
    }

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
            admin_user: 'Permisos Admin',
            info: 'Información'
        }
        return labels[type] || 'Notificación'
    }

    const unreadCount = notifications.filter(n => !n.read).length

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
                        Notificaciones
                        {unreadCount > 0 && (
                            <span className="bg-[#FC9430] text-white text-xs px-2 py-1 rounded-full">
                                {unreadCount} nuevas
                            </span>
                        )}
                    </h2>
                    <p className="text-on-surface-variant mt-1">
                        Actividad reciente y alertas del sistema
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={markAllAsRead}
                        className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors"
                    >
                        Marcar todas como leídas
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="flex gap-2 border-b border-outline-variant">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'all'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Todas ({notifications.length})
                </button>
                <button
                    onClick={() => setFilter('unread')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'unread'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    No leídas ({unreadCount})
                </button>
                <button
                    onClick={() => setFilter('read')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'read'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Leídas ({notifications.length - unreadCount})
                </button>
            </div>

            {/* Lista de notificaciones */}
            <div className="space-y-3">
                {getFilteredNotifications().length === 0 ? (
                    <div className="bg-white rounded-xl border border-outline-variant p-12 text-center">
                        <Icon name="notifications_off" className="text-5xl text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-600">No hay notificaciones</h3>
                        <p className="text-sm text-gray-400 mt-1">No hay notificaciones para mostrar</p>
                    </div>
                ) : (
                    getFilteredNotifications().map(notification => (
                        <div
                            key={notification.id}
                            className={`bg-white rounded-xl border transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-l-[#FC9430] bg-gradient-to-r from-white to-orange-50/30' : 'border-outline-variant'
                                }`}
                        >
                            <div className="p-4">
                                <div className="flex items-start gap-4">
                                    {/* Icono */}
                                    <div className={`w-10 h-10 ${notification.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                                        <Icon name={notification.icon} className={`text-lg ${notification.iconColor}`} />
                                    </div>

                                    {/* Contenido */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div>
                                                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                                    {notification.title}
                                                    {!notification.read && (
                                                        <span className="w-2 h-2 bg-[#FC9430] rounded-full"></span>
                                                    )}
                                                </h4>
                                                <p className="text-sm text-gray-500 mt-0.5">
                                                    {getTypeLabel(notification.type)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs text-gray-400 whitespace-nowrap">
                                                    {formatTimeAgo(notification.timestamp)}
                                                </span>
                                                <button
                                                    onClick={() => deleteNotification(notification.id)}
                                                    className="text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Icon name="close" className="text-sm" />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 mt-2">{notification.message}</p>

                                        {/* Información adicional del usuario */}
                                        {notification.user && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                                <div className="flex flex-wrap gap-4 text-sm">
                                                    <div>
                                                        <span className="text-xs text-gray-400">Nombre</span>
                                                        <p className="font-medium">{notification.user.name}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-xs text-gray-400">Email</span>
                                                        <p className="font-medium">{notification.user.email}</p>
                                                    </div>
                                                    {notification.user.company && (
                                                        <div>
                                                            <span className="text-xs text-gray-400">Empresa</span>
                                                            <p className="font-medium">{notification.user.company}</p>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="text-xs text-gray-400">Registro</span>
                                                        <p className="font-medium">
                                                            {new Date(notification.user.createdAt).toLocaleDateString('es-CL')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Botones de acción */}
                                        <div className="mt-3 flex gap-3">
                                            {!notification.read && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="text-xs text-primary hover:text-[#FC9430] transition-colors font-medium"
                                                >
                                                    Marcar como leída
                                                </button>
                                            )}
                                            {notification.type === 'new_user' && (
                                                <button
                                                    onClick={() => window.location.href = `/admin/clientes`}
                                                    className="text-xs text-primary hover:text-[#FC9430] transition-colors font-medium"
                                                >
                                                    Ver cliente
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

            {/* Footer informativo */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-400">
                    Las notificaciones se actualizan automáticamente.
                    Los datos se basan en la actividad reciente de los usuarios.
                </p>
            </div>
        </div>
    )
}