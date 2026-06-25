// src/pages/admin/zones/messages/AdminMessagesStats.jsx
import { useState, useEffect } from 'react'
import Icon from '../../../../components/ui/Icon'
import api from '../../../../config/api'

// ✅ Definir statusOptions AQUÍ (fuera del componente)
const statusOptions = [
    { value: 'pending', label: 'Pendiente', color: 'bg-yellow-500' },
    { value: 'read', label: 'Leído', color: 'bg-blue-500' },
    { value: 'responded', label: 'Respondido', color: 'bg-green-500' },
    { value: 'archived', label: 'Archivado', color: 'bg-gray-500' },
]

export default function AdminMessagesStats() {
    const [stats, setStats] = useState(null)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalMessages, setTotalMessages] = useState(0)
    const itemsPerPage = 10

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true)
                const [statsData, messagesData] = await Promise.all([
                    api.contact.getStats(),
                    api.contact.getAll(null, 1, 100)
                ])
                setStats(statsData)
                setMessages(messagesData.data || [])
                setTotalPages(messagesData.totalPages || 1)
                setTotalMessages(messagesData.total || 0)
            } catch (err) {
                console.error('Error fetching message stats:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [])

    // Mensajes por mes (últimos 6 meses)
    const getMessagesByMonth = () => {
        const months = {}
        const now = new Date()

        for (let i = 0; i < 6; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthKey = date.toLocaleString('es-CL', { month: 'short', year: '2-digit' })
            months[monthKey] = 0
        }

        messages.forEach(message => {
            const createdAt = new Date(message.createdAt)
            const monthKey = createdAt.toLocaleString('es-CL', { month: 'short', year: '2-digit' })
            if (months[monthKey] !== undefined) {
                months[monthKey]++
            }
        })

        return Object.entries(months).reverse()
    }

    const monthlyData = getMessagesByMonth()
    const maxMonthlyMessages = Math.max(...monthlyData.map(([, count]) => count), 1)

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
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Anterior
                </button>
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 text-sm border rounded-lg ${currentPage === page ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Siguiente
                </button>
            </div>
        )
    }

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
                <p className="text-red-700">{error}</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                    <Icon name="bar_chart" className="text-4xl" />
                    Estadísticas de Mensajes
                </h2>
                <p className="text-on-surface-variant mt-1">Métricas y análisis de mensajes de contacto</p>
            </div>

            {/* Cards de métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon name="mail" className="text-2xl text-primary" />
                        </div>
                        <span className="text-3xl font-bold text-primary">{stats?.total || 0}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Total Mensajes</h3>
                    <p className="text-xs text-gray-500 mt-1">Mensajes recibidos</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Icon name="pending" className="text-2xl text-yellow-600" />
                        </div>
                        <span className="text-3xl font-bold text-yellow-600">{stats?.pending || 0}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Pendientes</h3>
                    <p className="text-xs text-gray-500 mt-1">Sin revisar</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Icon name="visibility" className="text-2xl text-blue-600" />
                        </div>
                        <span className="text-3xl font-bold text-blue-600">{stats?.read || 0}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Leídos</h3>
                    <p className="text-xs text-gray-500 mt-1">Revisados</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Icon name="check_circle" className="text-2xl text-green-600" />
                        </div>
                        <span className="text-3xl font-bold text-green-600">{stats?.responded || 0}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Respondidos</h3>
                    <p className="text-xs text-gray-500 mt-1">Atendidos</p>
                </div>
            </div>

            {/* Distribución por estado */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
                        <Icon name="pie_chart" />
                        Distribución por Estado
                    </h3>
                    <div className="space-y-4">
                        {statusOptions.map(opt => {
                            const count = stats?.[opt.value] || 0
                            const percentage = stats?.total > 0 ? Math.round((count / stats.total) * 100) : 0
                            return (
                                <div key={opt.value}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium">{opt.label}</span>
                                        <span className="text-sm font-bold text-gray-600">{count} ({percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className={`${opt.color} h-3 rounded-full transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Evolución mensual */}
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
                        <Icon name="timeline" />
                        Evolución de Mensajes (últimos 6 meses)
                    </h3>
                    <div className="space-y-4">
                        {monthlyData.map(([month, count]) => (
                            <div key={month}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-600">{month}</span>
                                    <span className="text-sm font-bold text-primary">{count} mensajes</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-primary to-[#FC9430] h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${(count / maxMonthlyMessages) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Últimos mensajes */}
            <div className="bg-white border rounded-lg shadow-sm">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-primary flex items-center gap-2">
                        <Icon name="history" />
                        Últimos Mensajes Recibidos
                    </h3>
                    <span className="text-sm text-gray-500">
                        Mostrando {messages.slice(0, itemsPerPage).length} de {totalMessages} mensajes
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-bold">#</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">Remitente</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">Asunto</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">Fecha</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.slice(0, itemsPerPage).length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-500">
                                        No hay mensajes registrados
                                    </td>
                                </tr>
                            ) : (
                                messages.slice(0, itemsPerPage).map((message, index) => {
                                    const statusOption = statusOptions.find(opt => opt.value === message.status)
                                    return (
                                        <tr key={message.id} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-400 font-mono">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{message.name}</div>
                                                <div className="text-xs text-gray-500">{message.email}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm">{message.subject}</div>
                                                <div className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">
                                                    {message.message}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {new Date(message.createdAt).toLocaleDateString('es-CL')}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`${statusOption?.color || 'bg-gray-500'} text-white px-2 py-1 text-xs font-bold uppercase rounded`}>
                                                    {statusOption?.label || message.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination />
                <div className="px-4 py-3 border-t bg-gray-50 text-center text-xs text-gray-500">
                    Página {currentPage} de {totalPages} · Mostrando {messages.slice(0, itemsPerPage).length} de {totalMessages} mensajes
                </div>
            </div>
        </div>
    )
}