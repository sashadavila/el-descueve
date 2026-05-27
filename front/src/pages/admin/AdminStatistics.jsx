import { useState, useEffect } from 'react'
import api from '../../config/api'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../../components/ui/Icon'

export default function AdminStatistics() {
    const { isAdmin } = useAuth()
    const [stats, setStats] = useState(null)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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
                setUsers(allUsers)
            } catch (err) {
                console.error('Error fetching statistics:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [isAdmin])

    // Calcular porcentajes
    const activePercentage = stats ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0
    const clientPercentage = stats ? Math.round((stats.clientUsers / stats.totalUsers) * 100) : 0
    const adminPercentage = stats ? Math.round((stats.adminUsers / stats.totalUsers) * 100) : 0

    // Contar usuarios por mes (últimos 6 meses)
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

    return (
        <>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-primary">Análisis de Usuarios</h2>
                    <p className="text-on-surface-variant">Métricas de rendimiento y seguimiento de clientes</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border p-6 shadow-sm">
                    <p className="text-sm uppercase text-slate-500">Usuarios Totales</p>
                    <div className="text-3xl font-bold text-primary">{stats?.totalUsers || 0}</div>
                    <div className="mt-2 text-xs text-slate-400">
                        <span className="text-green-600">+{stats?.newUsersThisMonth || 0}</span> este mes
                    </div>
                </div>
                <div className="bg-white border p-6 shadow-sm">
                    <p className="text-sm uppercase text-slate-500">Tasa de Actividad</p>
                    <div className="text-3xl font-bold text-primary">{activePercentage}%</div>
                    <div className="mt-2 text-xs text-slate-400">
                        {stats?.activeUsers || 0} usuarios activos
                    </div>
                </div>
                <div className="bg-white border p-6 shadow-sm">
                    <p className="text-sm uppercase text-slate-500">Clientes vs Admins</p>
                    <div className="text-3xl font-bold text-primary">{clientPercentage}%</div>
                    <div className="mt-2 text-xs text-slate-400">
                        {stats?.clientUsers || 0} clientes · {stats?.adminUsers || 0} admins
                    </div>
                </div>
                <div className="bg-white border p-6 shadow-sm">
                    <p className="text-sm uppercase text-slate-500">Valor por Cliente (LTV)</p>
                    <div className="text-3xl font-bold text-primary">$1,850</div>
                    <div className="mt-2 text-xs text-slate-400">*Pendiente integración con pedidos</div>
                </div>
            </div>

            {/* Distribución por Rol */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border p-6 shadow-sm">
                    <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                        <Icon name="pie_chart" />
                        Distribución por Rol
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">Clientes</span>
                                <span className="text-sm font-bold text-primary">{clientPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full" style={{ width: `${clientPercentage}%` }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">Administradores</span>
                                <span className="text-sm font-bold text-primary">{adminPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-[#FC9430] h-2 rounded-full" style={{ width: `${adminPercentage}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registros por mes */}
                <div className="bg-white border p-6 shadow-sm">
                    <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                        <Icon name="timeline" />
                        Nuevos Registros (últimos 6 meses)
                    </h3>
                    <div className="space-y-3">
                        {monthlyData.map(([month, count]) => (
                            <div key={month}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs uppercase font-bold text-slate-500">{month}</span>
                                    <span className="text-xs font-bold text-primary">{count} usuarios</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-[#FC9430] h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${(count / maxMonthlyRegistrations) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Últimos usuarios registrados */}
            <div className="bg-white border shadow-sm">
                <div className="p-4 border-b">
                    <h4 className="font-bold text-primary flex items-center gap-2">
                        <Icon name="person_add" />
                        Últimos Usuarios Registrados
                    </h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm">NOMBRE</th>
                                <th className="px-4 py-3 text-left text-sm">EMAIL</th>
                                <th className="px-4 py-3 text-left text-sm">EMPRESA</th>
                                <th className="px-4 py-3 text-left text-sm">FECHA</th>
                                <th className="px-4 py-3 text-left text-sm">ROL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.slice(0, 5).map(user => (
                                <tr key={user.id} className="border-t hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium">{user.name}</td>
                                    <td className="px-4 py-3 text-sm">{user.email}</td>
                                    <td className="px-4 py-3 text-sm">{user.company || '—'}</td>
                                    <td className="px-4 py-3 text-sm">
                                        {new Date(user.createdAt).toLocaleDateString('es-CL')}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700'}`}>
                                            {user.role === 'admin' ? 'Admin' : 'Cliente'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}