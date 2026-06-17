// src/pages/admin/zones/clients/AdminClientsStats.jsx
import { useState, useEffect } from 'react'
import api from '../../../../config/api'
import { useAuth } from '../../../../hooks/useAuth'
import Icon from '../../../../components/ui/Icon'

export default function AdminClientsStats() {
    const { isAdmin } = useAuth()
    const [stats, setStats] = useState(null)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // ✅ Estado para paginación de la tabla de últimos clientes
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)

    useEffect(() => {
        const fetchStats = async () => {
            if (!isAdmin) return

            try {
                setLoading(true)
                const [userStats, allUsers] = await Promise.all([
                    api.admin.getUserStats(),
                    api.admin.getAllUsers()
                ])
                setStats(userStats)
                setUsers(allUsers.filter(u => u.role === 'client'))
            } catch (err) {
                console.error('Error fetching client statistics:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [isAdmin])

    // ✅ Calcular porcentajes
    const activePercentage = stats ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0

    // ✅ Contar usuarios por mes (últimos 6 meses)
    const getMonthlyRegistrations = () => {
        const months = {}
        const now = new Date()

        for (let i = 0; i < 6; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const monthKey = date.toLocaleString('es-CL', { month: 'short', year: '2-digit' })
            months[monthKey] = 0
        }

        users.forEach(user => {
            const createdAt = new Date(user.createdAt)
            const monthKey = createdAt.toLocaleString('es-CL', { month: 'short', year: '2-digit' })
            if (months[monthKey] !== undefined) {
                months[monthKey]++
            }
        })

        return Object.entries(months).reverse()
    }

    // ✅ Obtener clientes paginados
    const getPaginatedClients = () => {
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        return users.slice(startIndex, endIndex)
    }

    // ✅ Calcular total de páginas
    const totalPages = Math.ceil(users.length / itemsPerPage)

    // ✅ Cambiar página
    const handlePageChange = (page) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // ✅ Componente de paginación
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
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    Anterior
                </button>

                {startPage > 1 && (
                    <>
                        <button
                            onClick={() => handlePageChange(1)}
                            className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            1
                        </button>
                        {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
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
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                    Siguiente
                </button>
            </div>
        )
    }

    // ✅ Calcular rango de registros mostrados
    const getDisplayRange = () => {
        const start = (currentPage - 1) * itemsPerPage + 1
        const end = Math.min(currentPage * itemsPerPage, users.length)
        return { start, end }
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
                <p className="text-red-700">Error al cargar estadísticas: {error}</p>
            </div>
        )
    }

    const monthlyData = getMonthlyRegistrations()
    const maxMonthlyRegistrations = Math.max(...monthlyData.map(([, count]) => count), 1)
    const paginatedClients = getPaginatedClients()
    const { start, end } = getDisplayRange()

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                    <Icon name="bar_chart" className="text-4xl" />
                    Estadísticas de Clientes
                </h2>
                <p className="text-on-surface-variant mt-1">Métricas y análisis de clientes</p>
            </div>

            {/* Cards de métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon name="groups" className="text-2xl text-primary" />
                        </div>
                        <span className="text-3xl font-bold text-primary">{stats?.clientUsers || 0}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Total Clientes</h3>
                    <p className="text-xs text-gray-500 mt-1">Usuarios registrados</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Icon name="check_circle" className="text-2xl text-green-600" />
                        </div>
                        <span className="text-3xl font-bold text-green-600">{stats?.activeUsers || 0}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Clientes Activos</h3>
                    <p className="text-xs text-gray-500 mt-1">{activePercentage}% del total</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-[#FC9430]/10 rounded-full flex items-center justify-center">
                            <Icon name="person_add" className="text-2xl text-[#FC9430]" />
                        </div>
                        <span className="text-3xl font-bold text-[#FC9430]">{stats?.newUsersThisMonth || 0}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Nuevos este mes</h3>
                    <p className="text-xs text-gray-500 mt-1">Registros de clientes</p>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Icon name="verified" className="text-2xl text-blue-600" />
                        </div>
                        <span className="text-3xl font-bold text-blue-600">{stats?.adminUsers || 0}</span>
                    </div>
                    <h3 className="font-bold text-gray-700">Administradores</h3>
                    <p className="text-xs text-gray-500 mt-1">Usuarios con rol admin</p>
                </div>
            </div>

            {/* Gráfico de registros mensuales */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
                    <Icon name="timeline" />
                    Nuevos Registros (últimos 6 meses)
                </h3>
                <div className="space-y-4">
                    {monthlyData.map(([month, count]) => (
                        <div key={month}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-600">{month}</span>
                                <span className="text-sm font-bold text-primary">{count} clientes</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-primary to-[#FC9430] h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${(count / maxMonthlyRegistrations) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
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
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Clientes Activos</span>
                                <span className="text-sm font-bold text-green-600">{activePercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${activePercentage}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Clientes Inactivos</span>
                                <span className="text-sm font-bold text-red-600">{100 - activePercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${100 - activePercentage}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border rounded-lg p-6 shadow-sm">
                    <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
                        <Icon name="admin_panel_settings" />
                        Distribución por Rol
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Clientes</span>
                                <span className="text-sm font-bold text-primary">{Math.round((stats?.clientUsers / stats?.totalUsers) * 100) || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: `${(stats?.clientUsers / stats?.totalUsers) * 100 || 0}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium">Administradores</span>
                                <span className="text-sm font-bold text-[#FC9430]">{Math.round((stats?.adminUsers / stats?.totalUsers) * 100) || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-[#FC9430] h-2 rounded-full" style={{ width: `${(stats?.adminUsers / stats?.totalUsers) * 100 || 0}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Últimos clientes registrados - CON PAGINACIÓN */}
            <div className="bg-white border rounded-lg shadow-sm">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-primary flex items-center gap-2">
                        <Icon name="person_add" />
                        Últimos Clientes Registrados
                    </h3>
                    <span className="text-sm text-gray-500">
                        Mostrando {start} - {end} de {users.length} clientes
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-bold">#</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">Cliente</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">Email</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">Empresa</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">Fecha Registro</th>
                                <th className="px-4 py-3 text-left text-sm font-bold">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedClients.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-8 text-gray-500">
                                        No hay clientes registrados
                                    </td>
                                </tr>
                            ) : (
                                paginatedClients.map((user, index) => {
                                    const globalIndex = (currentPage - 1) * itemsPerPage + index + 1
                                    return (
                                        <tr key={user.id} className="border-t hover:bg-slate-50">
                                            <td className="px-4 py-3 text-sm text-gray-400 font-mono">
                                                {globalIndex}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-800">
                                                {user.name}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {user.company || '—'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500">
                                                {new Date(user.createdAt).toLocaleDateString('es-CL', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="px-4 py-3">
                                                {user.isActive ? (
                                                    <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium">
                                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                        Activo
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-red-600 text-sm font-medium">
                                                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                        Inactivo
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ✅ Paginación */}
                <Pagination />

                {/* ✅ Información de paginación */}
                {users.length > 0 && (
                    <div className="px-4 py-3 border-t bg-gray-50 text-center text-xs text-gray-500">
                        Página {currentPage} de {totalPages} ·
                        Mostrando {paginatedClients.length} de {users.length} clientes
                        {totalPages > 1 && (
                            <span className="ml-2 text-primary">
                                (Puedes navegar entre páginas usando los botones)
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}