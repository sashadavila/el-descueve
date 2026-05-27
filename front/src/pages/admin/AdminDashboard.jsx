import { useState, useEffect } from 'react'
import api from '../../config/api'
import { useAuth } from '../../hooks/useAuth'

export default function AdminDashboard() {
    const { isAdmin, user } = useAuth()
    const [orders, setOrders] = useState([])
    const [userStats, setUserStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            if (!isAdmin) {
                console.log('⚠️ No es admin, no se cargan datos');
                setLoading(false);
                return;
            }

            try {
                setLoading(true)
                setError(null)

                console.log('📊 [AdminDashboard] Obteniendo estadísticas...');
                console.log('📊 [AdminDashboard] Token en localStorage:', localStorage.getItem('access_token')?.substring(0, 50));

                // Obtener estadísticas de usuarios
                const stats = await api.admin.getUserStats()
                console.log('📊 [AdminDashboard] Estadísticas recibidas:', stats)
                setUserStats(stats)

                // Aquí cargarías las órdenes desde el backend
                // const ordersData = await api.admin.getAllOrders()
                // setOrders(ordersData)

            } catch (err) {
                console.error('❌ Error fetching admin data:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [isAdmin])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="ml-3 text-gray-500">Cargando datos del dashboard...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-red-500">error</span>
                    <div>
                        <h3 className="font-bold text-red-700 mb-1">Error al cargar datos</h3>
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-3 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-primary">Resumen de Pedidos</h2>
                    <p className="text-on-surface-variant">Seguimiento de cotizaciones, pedidos y despachos.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-primary-container text-white p-6">
                    <p className="text-sm uppercase opacity-80 mb-2">Usuarios Totales</p>
                    <h3 className="text-4xl font-black">{userStats?.totalUsers || 0}</h3>
                </div>
                <div className="bg-white p-6 border">
                    <p className="text-sm uppercase text-slate-500">Clientes Activos</p>
                    <h3 className="text-2xl font-bold text-primary">{userStats?.clientUsers || 0}</h3>
                </div>
                <div className="bg-white p-6 border">
                    <p className="text-sm uppercase text-slate-500">Nuevos (este mes)</p>
                    <h3 className="text-2xl font-bold text-primary">{userStats?.newUsersThisMonth || 0}</h3>
                </div>
                <div className="bg-white p-6 border">
                    <p className="text-sm uppercase text-slate-500">Admins</p>
                    <h3 className="text-2xl font-bold text-primary">{userStats?.adminUsers || 0}</h3>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white border">
                <div className="p-4 border-b">
                    <h4 className="font-bold text-primary">Pedidos Recientes</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm">PEDIDO ID</th>
                                <th className="px-4 py-3 text-left text-sm">CLIENTE</th>
                                <th className="px-4 py-3 text-left text-sm">ESTADO</th>
                                <th className="px-4 py-3 text-left text-sm">MONTO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-8 text-gray-500">
                                        No hay pedidos recientes
                                    </td>
                                </tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id} className="border-t hover:bg-slate-50">
                                        <td className="px-4 py-3 font-bold text-primary">#{order.id}</td>
                                        <td className="px-4 py-3">{order.userName || 'Cliente'}</td>
                                        <td className="px-4 py-3">
                                            <span className="bg-[#FC9430] text-white px-2 py-1 text-xs">
                                                {order.status || 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-bold">${(order.total || 0).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}