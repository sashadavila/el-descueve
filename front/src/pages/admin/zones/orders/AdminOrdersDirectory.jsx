// src/pages/admin/zones/orders/AdminOrdersDirectory.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../../../components/ui/Icon'
import api from '../../../../config/api'

export default function AdminOrdersDirectory() {
    const [orders, setOrders] = useState([])
    const [users, setUsers] = useState([])
    const [shipments, setShipments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [newStatus, setNewStatus] = useState('')
    const [updating, setUpdating] = useState(false)

    // ✅ Estados de orden (sin Entregado porque viene de envíos)
    const statusOptions = [
        { value: 'PENDING', label: 'No Pagado', color: 'bg-yellow-500' },
        { value: 'PAID', label: 'Pagado', color: 'bg-blue-500' },
        { value: 'CANCELLED', label: 'Cancelado', color: 'bg-red-500' },
    ]

    // ✅ Mapeo de estados de envío
    const shipmentStatusMap = {
        'Pedido Recibido': { label: 'Pedido Recibido', color: 'bg-yellow-500', icon: 'task_alt' },
        'En Preparación': { label: 'En Preparación', color: 'bg-blue-500', icon: 'inventory_2' },
        'En Tránsito': { label: 'En Tránsito', color: 'bg-orange-500', icon: 'local_shipping' },
        'Entregado': { label: 'Entregado', color: 'bg-green-500', icon: 'check_circle' }
    }

    useEffect(() => {
        fetchOrders()
        fetchUsers()
        fetchShipments()
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

    const fetchUsers = async () => {
        try {
            const usersData = await api.admin.getAllUsers()
            const userMap = {}
            usersData.forEach(user => {
                userMap[user.id] = user
            })
            setUsers(userMap)
        } catch (err) {
            console.error('Error fetching users:', err)
        }
    }

    const fetchShipments = async () => {
        try {
            const shipmentsData = await api.shipments.getAll()
            const shipmentMap = {}
            shipmentsData.data?.forEach(shipment => {
                shipmentMap[shipment.orderId] = shipment
            })
            setShipments(shipmentMap)
        } catch (err) {
            console.error('Error fetching shipments:', err)
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

    const openDetailModal = (order) => {
        setSelectedOrder(order)
        setShowDetailModal(true)
    }

    // ✅ Obtener badge de estado de orden
    const getOrderStatusBadge = (status) => {
        const option = statusOptions.find(opt => opt.value === status)
        if (option) {
            return (
                <span className={`${option.color} text-white px-2 py-1 text-xs font-bold uppercase rounded`}>
                    {option.label}
                </span>
            )
        }
        // Si no está en las opciones, mostrar el estado original
        return (
            <span className="bg-gray-500 text-white px-2 py-1 text-xs font-bold uppercase rounded">
                {status}
            </span>
        )
    }

    // ✅ Obtener badge de estado de envío
    const getShipmentStatusBadge = (shipmentStatus) => {
        if (!shipmentStatus) {
            return (
                <span className="bg-gray-400 text-white px-2 py-1 text-xs font-bold uppercase rounded">
                    Sin envío
                </span>
            )
        }
        const info = shipmentStatusMap[shipmentStatus] || {
            label: shipmentStatus,
            color: 'bg-gray-500',
            icon: 'help'
        }
        return (
            <span className={`${info.color} text-white px-2 py-1 text-xs font-bold uppercase rounded flex items-center gap-1`}>
                <Icon name={info.icon} className="text-[10px]" />
                {info.label}
            </span>
        )
    }

    // ✅ Obtener el estado del envío para una orden
    const getShipmentStatusForOrder = (orderId) => {
        const shipment = shipments[orderId]
        return shipment?.status || null
    }

    // ✅ Obtener el tracking number para una orden
    const getTrackingNumberForOrder = (orderId) => {
        const shipment = shipments[orderId]
        return shipment?.trackingNumber || null
    }

    // ✅ Obtener el carrier para una orden
    const getCarrierForOrder = (orderId) => {
        const shipment = shipments[orderId]
        if (!shipment) return null
        return shipment.carrier === 'externo' ? shipment.carrierName || 'Externo' : 'Envío Propio'
    }

    const getClientName = (userId) => {
        if (users[userId]) {
            return users[userId].name
        }
        return userId?.slice(-8) || 'N/A'
    }

    const getClientEmail = (userId) => {
        if (users[userId]) {
            return users[userId].email
        }
        return ''
    }

    const getClientCompany = (userId) => {
        if (users[userId]) {
            return users[userId].company
        }
        return null
    }

    const getClientPhone = (userId) => {
        if (users[userId]) {
            return users[userId].phone
        }
        return null
    }

    // ✅ Filtrado de órdenes
    const filteredOrders = orders.filter(order => {
        const clientName = getClientName(order.userId).toLowerCase()
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            clientName.includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === 'all' || order.status === filterStatus
        return matchesSearch && matchesStatus
    })

    const getTotalByStatus = (status) => {
        return orders.filter(o => o.status === status).length
    }

    const calculateOrderDetails = () => {
        if (!selectedOrder) return { subtotal: 0, iva: 0, total: 0 }

        const subtotal = selectedOrder.items?.reduce((sum, item) => sum + (parseFloat(item.subtotal) || 0), 0) || parseFloat(selectedOrder.total) || 0
        const iva = subtotal * 0.19
        const total = subtotal + 4500 + iva

        return { subtotal, iva, total }
    }

    const { subtotal, iva, total } = calculateOrderDetails()

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
                    {/* ✅ Tarjeta de estado de envío */}
                    <div
                        className="bg-green-500 bg-opacity-10 rounded-lg p-4 cursor-pointer hover:bg-opacity-20 transition-all"
                        onClick={() => setFilterStatus('DELIVERED')}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-gray-700">Estado Envío</span>
                            <span className="bg-green-500 text-white text-sm font-bold px-2 py-0.5 rounded-full">
                                {orders.filter(o => getShipmentStatusForOrder(o.id) === 'Entregado').length}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <Icon name="search" className="text-gray-400 text-sm" />
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar por ID de orden o nombre del cliente..."
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
                        <option value="DELIVERED">Entregado (Envío)</option>
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
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Contacto</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Fecha</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Productos</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Total</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Estado</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Envío</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="text-center py-8 text-gray-500">
                                            No se encontraron pedidos
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(order => {
                                        const shipmentStatus = getShipmentStatusForOrder(order.id)
                                        const trackingNumber = getTrackingNumberForOrder(order.id)
                                        const carrier = getCarrierForOrder(order.id)

                                        return (
                                            <tr key={order.id} className="border-t hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div className="font-mono text-sm font-bold text-primary">
                                                        {order.id.slice(-8).toUpperCase()}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-medium text-gray-800">
                                                        {getClientName(order.userId)}
                                                    </div>
                                                    {getClientCompany(order.userId) && (
                                                        <div className="text-xs text-gray-500">
                                                            {getClientCompany(order.userId)}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-sm text-gray-600">
                                                        {getClientEmail(order.userId)}
                                                    </div>
                                                    {getClientPhone(order.userId) && (
                                                        <div className="text-xs text-gray-400">
                                                            {getClientPhone(order.userId)}
                                                        </div>
                                                    )}
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
                                                    {getOrderStatusBadge(order.status)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col gap-1">
                                                        {shipmentStatus ? (
                                                            <>
                                                                {getShipmentStatusBadge(shipmentStatus)}
                                                                {trackingNumber && (
                                                                    <span className="text-[10px] text-gray-400 font-mono">
                                                                        {trackingNumber}
                                                                    </span>
                                                                )}
                                                                {carrier && (
                                                                    <span className="text-[10px] text-gray-400">
                                                                        {carrier}
                                                                    </span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <span className="text-xs text-gray-400">Sin envío</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => openDetailModal(order)}
                                                            className="text-primary hover:text-[#FC9430] transition-colors"
                                                            title="Ver detalles"
                                                        >
                                                            <Icon name="visibility" className="text-sm" />
                                                        </button>
                                                        <button
                                                            onClick={() => openStatusModal(order)}
                                                            className="text-[#FC9430] hover:text-primary transition-colors"
                                                            title="Cambiar estado"
                                                        >
                                                            <Icon name="edit" className="text-sm" />
                                                        </button>
                                                        <Link
                                                            to={`/factura/${order.id}`}
                                                            target="_blank"
                                                            className="text-green-600 hover:text-green-800 transition-colors"
                                                            title="Ver factura"
                                                        >
                                                            <Icon name="receipt" className="text-sm" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
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
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Cliente</p>
                                <p className="font-medium">{getClientName(selectedOrder.userId)}</p>
                                <p className="text-xs text-gray-400">{getClientEmail(selectedOrder.userId)}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Monto</p>
                                <p className="font-bold text-[#FC9430]">${(parseFloat(selectedOrder.total) || 0).toLocaleString()}</p>
                            </div>

                            {/* ✅ Estado actual del envío (solo lectura) */}
                            {(() => {
                                const shipmentStatus = getShipmentStatusForOrder(selectedOrder.id)
                                const trackingNumber = getTrackingNumberForOrder(selectedOrder.id)
                                if (shipmentStatus) {
                                    return (
                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase font-bold">Estado del Envío</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {getShipmentStatusBadge(shipmentStatus)}
                                                {trackingNumber && (
                                                    <span className="text-xs text-gray-400 font-mono">
                                                        {trackingNumber}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                ⚠️ El estado del envío se gestiona desde la zona de envíos
                                            </p>
                                        </div>
                                    )
                                }
                                return null
                            })()}

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
                                <p className="text-xs text-gray-400 mt-2">
                                    * El estado "Entregado" se gestiona automáticamente desde el envío
                                </p>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg mb-4">
                                <p className="text-xs text-blue-700">
                                    <strong>Nota:</strong> Al cambiar el estado de la orden, se actualizará el estado del envío asociado (si existe).
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

            {/* Modal de Detalle del Pedido */}
            {showDetailModal && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-primary">Detalle del Pedido</h3>
                            <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                                <Icon name="close" className="text-2xl" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Información del pedido */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">N° Orden</p>
                                    <p className="font-mono font-bold text-primary text-lg">{selectedOrder.id.slice(-8).toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Fecha</p>
                                    <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString('es-CL')}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Estado</p>
                                    {getOrderStatusBadge(selectedOrder.status)}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Última actualización</p>
                                    <p className="font-medium">{new Date(selectedOrder.updatedAt).toLocaleString('es-CL')}</p>
                                </div>
                            </div>

                            {/* Información del envío */}
                            {(() => {
                                const shipmentStatus = getShipmentStatusForOrder(selectedOrder.id)
                                const trackingNumber = getTrackingNumberForOrder(selectedOrder.id)
                                const carrier = getCarrierForOrder(selectedOrder.id)
                                if (shipmentStatus || trackingNumber) {
                                    return (
                                        <div className="pb-4 border-b">
                                            <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                                                <Icon name="local_shipping" className="text-sm" />
                                                Información del Envío
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-xs text-gray-400">Estado del Envío</p>
                                                    {getShipmentStatusBadge(shipmentStatus)}
                                                </div>
                                                {trackingNumber && (
                                                    <div>
                                                        <p className="text-xs text-gray-400">N° Seguimiento</p>
                                                        <p className="font-mono font-medium">{trackingNumber}</p>
                                                    </div>
                                                )}
                                                {carrier && (
                                                    <div>
                                                        <p className="text-xs text-gray-400">Transportista</p>
                                                        <p className="font-medium">{carrier}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            })()}

                            {/* Información del cliente */}
                            <div className="pb-4 border-b">
                                <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                                    <Icon name="person" className="text-sm" />
                                    Información del Cliente
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-gray-400">Nombre</p>
                                        <p className="font-medium">{getClientName(selectedOrder.userId)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Email</p>
                                        <p className="font-medium">{getClientEmail(selectedOrder.userId)}</p>
                                    </div>
                                    {getClientPhone(selectedOrder.userId) && (
                                        <div>
                                            <p className="text-xs text-gray-400">Teléfono</p>
                                            <p className="font-medium">{getClientPhone(selectedOrder.userId)}</p>
                                        </div>
                                    )}
                                    {getClientCompany(selectedOrder.userId) && (
                                        <div>
                                            <p className="text-xs text-gray-400">Empresa</p>
                                            <p className="font-medium">{getClientCompany(selectedOrder.userId)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Productos */}
                            <div className="pb-4 border-b">
                                <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                                    <Icon name="shopping_bag" className="text-sm" />
                                    Productos
                                </h4>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                                            <div className="flex-1">
                                                <p className="font-medium">{item.product?.name || 'Producto'}</p>
                                                <p className="text-xs text-gray-400">
                                                    Ref: {item.product?.reference || 'N/A'} | Cantidad: {item.quantity}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-primary">${(parseFloat(item.unitPrice) || 0).toLocaleString()}</p>
                                                <p className="text-xs text-gray-400">Subtotal: ${(parseFloat(item.subtotal) || 0).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Resumen de valores */}
                            <div>
                                <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                                    <Icon name="receipt" className="text-sm" />
                                    Resumen de Valores
                                </h4>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span className="font-medium">${Math.round(subtotal).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Envío (La Serena - Calbuco)</span>
                                            <span className="font-medium">$4.500</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">IVA (19%)</span>
                                            <span className="font-medium">${Math.round(iva).toLocaleString()}</span>
                                        </div>
                                        <div className="border-t pt-2 mt-2">
                                            <div className="flex justify-between">
                                                <span className="text-lg font-bold text-primary">Total</span>
                                                <span className="text-xl font-bold text-[#FC9430]">${Math.round(total).toLocaleString()} CLP</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex justify-end gap-4 pt-4 border-t">
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="px-6 py-2 border border-gray-300 rounded font-bold hover:bg-gray-50"
                                >
                                    Cerrar
                                </button>
                                <Link
                                    to={`/factura/${selectedOrder.id}`}
                                    target="_blank"
                                    className="px-6 py-2 bg-primary text-white rounded font-bold hover:bg-primary/80 transition-colors flex items-center gap-2"
                                >
                                    <Icon name="receipt" className="text-sm" />
                                    Ver Factura Completa
                                </Link>
                                <button
                                    onClick={() => {
                                        setShowDetailModal(false)
                                        openStatusModal(selectedOrder)
                                    }}
                                    className="px-6 py-2 bg-[#FC9430] text-white rounded font-bold hover:bg-[#e0852b] transition-colors flex items-center gap-2"
                                >
                                    <Icon name="edit" className="text-sm" />
                                    Cambiar Estado
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}