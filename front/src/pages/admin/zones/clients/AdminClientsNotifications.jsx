// src/pages/admin/zones/clients/AdminClientsNotifications.jsx
import { useState, useEffect } from 'react'
import Icon from '../../../../components/ui/Icon'
import api from '../../../../config/api'

export default function AdminClientsNotifications() {
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all') // all, new_user, inactive_user

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const result = await api.notifications.getAll(null, 1, 50)
                // Filtrar notificaciones relacionadas con clientes
                const clientNotifications = result.data.filter(n =>
                    n.type === 'new_user' || n.type === 'inactive_user'
                )
                setNotifications(clientNotifications)
            } catch (error) {
                console.error('Error fetching client notifications:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchNotifications()
    }, [])

    const getFilteredNotifications = () => {
        if (filter === 'all') return notifications
        return notifications.filter(n => n.type === filter)
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
                    Notificaciones de Clientes
                </h2>
                <p className="text-on-surface-variant mt-1">Alertas sobre registros y estados de clientes</p>
            </div>

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
                    onClick={() => setFilter('new_user')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${filter === 'new_user'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Nuevos Registros
                </button>
                <button
                    onClick={() => setFilter('inactive_user')}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${filter === 'inactive_user'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Cuentas Inactivas
                </button>
            </div>

            {/* Lista de notificaciones */}
            <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                    <div className="bg-white rounded-xl border p-12 text-center">
                        <Icon name="notifications_off" className="text-5xl text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-600">No hay notificaciones</h3>
                        <p className="text-sm text-gray-400 mt-1">No hay alertas de clientes para mostrar</p>
                    </div>
                ) : (
                    filteredNotifications.map(notification => (
                        <div
                            key={notification.id}
                            className={`bg-white rounded-xl border transition-all hover:shadow-md ${notification.type === 'new_user'
                                ? 'border-l-4 border-l-green-500'
                                : 'border-l-4 border-l-red-500'
                                }`}
                        >
                            <div className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.type === 'new_user'
                                        ? 'bg-green-100'
                                        : 'bg-red-100'
                                        }`}>
                                        <Icon
                                            name={notification.type === 'new_user' ? 'person_add' : 'block'}
                                            className={`text-lg ${notification.type === 'new_user' ? 'text-green-600' : 'text-red-600'
                                                }`}
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                            <div>
                                                <h4 className="font-bold text-gray-800">{notification.title}</h4>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {notification.type === 'new_user' ? 'Nuevo Registro' : 'Cuenta Inactiva'}
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {formatTimeAgo(notification.createdAt)}
                                            </span>
                                        </div>

                                        <p className="text-gray-600 mt-2">{notification.message}</p>

                                        {notification.metadata && (
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
                    Total de notificaciones de clientes: <strong>{notifications.length}</strong>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    {notifications.filter(n => n.type === 'new_user').length} nuevos registros ·{' '}
                    {notifications.filter(n => n.type === 'inactive_user').length} cuentas inactivas
                </p>
            </div>
        </div>
    )
}