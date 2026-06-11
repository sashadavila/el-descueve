// src/pages/admin/zones/orders/AdminOrdersDirectory.jsx
import { useState, useEffect } from 'react'
import Icon from '../../../../components/ui/Icon'
import api from '../../../../config/api'

export default function AdminOrdersDirectory() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [newStatus, setNewStatus] = useState('')
    const [updating, setUpdating] = useState(false)

    const statusOptions = [
        { value: 'PENDING', label: 'Pendiente', color: 'bg-yellow-500' },
        { value: 'PAID', label: 'Pagado', color: 'bg-blue-500' },
        { value: 'CANCELLED', label: 'Cancelado', color: 'bg-red-500' },
        { value: 'DELIVERED', label: 'Entregado', color: 'bg-green-500' }
    ]

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            setLoading(true)
            const data = await api.orders.getAll()
            setOrders(data)
        } catch (err) {
            console.error('Error fetching orders:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async () => {
        if (!selectedOrder || !newStatus) return

        setUpdating(true)
        try {
            await api.orders.update(selectedOrder.id, { status: newStatus })
            await fetchOrders()
            setShowStatusModal(false)
            setSelectedOrder(null)
            setNewStatus('')
            alert('✅ Estado de la orden actualizado correctamente')
        } catch (err) {
            console.error('Error updating order status:', err)
            alert('❌ Error al actualizar el estado: ' + err.message)
        } finally {
            setUpdating(false)
        }
    }

    const openStatusModal = (order) => {
        setSelectedOrder(order)
        setNewStatus(order.status)
        setShowStatusModal(true)
    }

    const getStatusBadge = (status) => {
        const option = statusOptions.find(opt => opt.value === status)
        return (
            <span className={`${option?.color || 'bg-gray-500'} text-white px-2 py-1 text-xs font-bold uppercase rounded`}>
                {option?.label || status}
            </span>
        )
    }

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus
        return matchesSearch && matchesStatus
    })

    const getTotalByStatus = (status) => {
        return orders.filter(o => o.status === status).length
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                        <Icon name="receipt_long" className="text-4xl" />
                        Directorio de Pedidos
                    </h2>
                    <p className="text-on-surface-variant mt-1">Gestión de órdenes y actualización de estados</p>
                </div>

                {/* Resumen rápido por estado */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {statusOptions.map(opt => (
                        <div
                            key={opt.value}
                            className={`${opt.color} bg-opacity-10 rounded-lg p-4 cursor-pointer hover:bg-opacity-20 transition-all`}
                            onClick={() => setFilterStatus(opt.value)}
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-700">{opt.label}</span>
                                <span className={`${opt.color} text-white text-sm font-bold px-2 py-0.5 rounded-full`}>
                                    {getTotalByStatus(opt.value)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <Icon name="search" className="text-gray-400 text-sm" />
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar por ID de orden o usuario..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                    >
                        <option value="all">Todos los estados</option>
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => {
                            setSearchTerm('')
                            setFilterStatus('all')
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Limpiar filtros
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Tabla de pedidos */}
                <div className="bg-white rounded-xl border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">ID Orden</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Cliente</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Fecha</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Productos</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Total</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Estado</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8 text-gray-500">
                                            No se encontraron pedidos
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(order => (
                                        <tr key={order.id} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="font-mono text-sm font-bold text-primary">
                                                    {order.id.slice(-8).toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm">{order.userId?.slice(-8) || 'N/A'}</div>
                                                <div className="text-xs text-gray-500">ID: {order.userId?.slice(-8)}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {new Date(order.createdAt).toLocaleDateString('es-CL')}
                                                <div className="text-xs text-gray-400">
                                                    {new Date(order.createdAt).toLocaleTimeString('es-CL')}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm">{order.items?.length || 0} productos</div>
                                                <div className="text-xs text-gray-500">
                                                    {order.items?.reduce((sum, item) => sum + item.quantity, 0)} unidades
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-primary">
                                                ${(parseFloat(order.total) || 0).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getStatusBadge(order.status)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => openStatusModal(order)}
                                                    className="text-primary hover:text-[#FC9430] transition-colors flex items-center gap-1"
                                                    title="Cambiar estado"
                                                >
                                                    <Icon name="edit" className="text-sm" />
                                                    <span className="text-xs uppercase font-bold">Estado</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Resumen */}
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600">
                        Total de pedidos: <strong>{orders.length}</strong> · Mostrando: <strong>{filteredOrders.length}</strong>
                    </p>
                </div>
            </div>

            {/* Modal para cambiar estado */}
            {showStatusModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-primary">Cambiar Estado de Orden</h3>
                            <button onClick={() => setShowStatusModal(false)} className="text-gray-400 hover:text-gray-600">
                                <Icon name="close" className="text-2xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">ID de Orden</p>
                                <p className="font-mono font-bold text-primary">{selectedOrder.id.slice(-8).toUpperCase()}</p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Nuevo Estado
                                </label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                                >
                                    {statusOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg mb-4">
                                <p className="text-xs text-blue-700">
                                    <strong>Nota:</strong> Al cambiar el estado de la orden, se actualizará automáticamente el estado del envío asociado (si existe).
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="flex-1 px-4 py-2 border rounded-lg font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpdateStatus}
                                    disabled={updating || newStatus === selectedOrder.status}
                                    className="flex-1 bg-[#FC9430] text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {updating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Actualizando...
                                        </>
                                    ) : (
                                        'Actualizar Estado'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}