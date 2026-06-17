// src/pages/public/OrderTrackingPage.jsx
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import { useAuth } from '../../hooks/useAuth'
import api from '../../config/api'

export default function OrderTrackingPage() {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const { isAuthenticated, loading: authLoading, user } = useAuth()
    const [userOrders, setUserOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [tracking, setTracking] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedOrderId, setSelectedOrderId] = useState(null)

    // Función para validar si es un UUID
    const isValidUUID = (id) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(id);
    }

    // Función para validar si es un número de seguimiento
    const isValidTrackingNumber = (number) => {
        const trackingRegex = /^ELD-\d{8}-[A-Z0-9]{8}-\d{3}$/i;
        return trackingRegex.test(number);
    }

    // Cargar las órdenes del usuario autenticado
    useEffect(() => {
        if (authLoading) return

        if (!isAuthenticated) {
            localStorage.setItem('redirectAfterLogin', '/seguimiento')
            navigate('/login', { state: { from: '/seguimiento' } })
            return
        }

        const fetchUserOrders = async () => {
            try {
                setLoading(true)
                setError(null)

                const allOrders = await api.orders.getAll()

                let userOrdersList = allOrders
                if (user?.role !== 'admin') {
                    userOrdersList = allOrders.filter(order => order.userId === user?.id)
                }

                userOrdersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

                setUserOrders(userOrdersList)

                if (orderId && isValidUUID(orderId)) {
                    const foundOrder = userOrdersList.find(o => o.id === orderId)
                    if (foundOrder) {
                        setSelectedOrderId(foundOrder.id)
                        await loadOrderTracking(foundOrder.id)
                    } else {
                        setError('No se encontró el pedido solicitado')
                    }
                }

            } catch (err) {
                console.error('Error fetching user orders:', err)
                setError(err.message || 'Error al cargar tus pedidos')
            } finally {
                setLoading(false)
            }
        }

        if (isAuthenticated && user) {
            fetchUserOrders()
        }
    }, [isAuthenticated, authLoading, user, orderId, navigate])

    // Cargar el tracking de una orden específica
    const loadOrderTracking = async (orderId) => {
        setLoading(true)
        setError(null)

        try {
            // Obtener la orden
            const orderData = await api.orders.getById(orderId)
            setSelectedOrder(orderData)

            // Obtener el seguimiento usando api.tracking
            try {
                const trackingData = await api.tracking.getByOrderId(orderId)
                if (trackingData) {
                    setTracking(trackingData)
                } else {
                    // Si no existe tracking, crearlo automáticamente
                    console.log('📦 Creando tracking para la orden...')
                    const newTracking = await api.shipments.createFromOrder(orderId, orderData.userId)
                    setTracking(newTracking)
                }
            } catch (err) {
                console.error('Error loading tracking:', err)
                // Si el error es 404 o "not found", crear tracking
                if (err.message?.includes('404') || err.message?.toLowerCase().includes('not found')) {
                    console.log('📦 Creando tracking para la orden (404)...')
                    const newTracking = await api.shipments.createFromOrder(orderId, orderData.userId)
                    setTracking(newTracking)
                } else {
                    throw err
                }
            }
        } catch (err) {
            console.error('Error loading tracking:', err)
            setError(err.message || 'Error al cargar el seguimiento del pedido')

            // Si hay error, crear un tracking básico para mostrar algo
            if (selectedOrder) {
                const tempTracking = {
                    id: 'temp',
                    orderId: selectedOrder.id,
                    userId: selectedOrder.userId,
                    trackingNumber: `PENDIENTE-${selectedOrder.id.slice(-8)}`,
                    carrier: 'propio',
                    status: 'Pedido Recibido',
                    trackingHistory: [
                        {
                            status: 'Pedido Recibido',
                            location: 'Planta La Serena',
                            timestamp: new Date(),
                            description: 'Pedido recibido - Seguimiento en proceso de activación'
                        }
                    ],
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
                setTracking(tempTracking)
                setError(null)
            }
        } finally {
            setLoading(false)
        }
    }

    // Buscar pedido por número de seguimiento o ID
    const handleSearchOrder = async () => {
        if (!searchTerm.trim()) {
            alert('Ingresa un ID de pedido o número de seguimiento')
            return
        }

        setLoading(true)
        setError(null)

        try {
            let orderData = null
            let trackingData = null

            if (isValidUUID(searchTerm)) {
                const orderExists = userOrders.find(o => o.id === searchTerm)
                if (orderExists) {
                    setSelectedOrderId(searchTerm)
                    await loadOrderTracking(searchTerm)
                    setSearchTerm('')
                    setLoading(false)
                    return
                } else {
                    throw new Error('No tienes acceso a este pedido')
                }
            } else if (isValidTrackingNumber(searchTerm)) {
                try {
                    trackingData = await api.tracking.getByTrackingNumber(searchTerm)
                    const orderBelongsToUser = userOrders.find(o => o.id === trackingData.orderId)
                    if (orderBelongsToUser || user?.role === 'admin') {
                        setSelectedOrderId(trackingData.orderId)
                        await loadOrderTracking(trackingData.orderId)
                        setSearchTerm('')
                        setLoading(false)
                        return
                    } else {
                        throw new Error('No tienes acceso a este pedido')
                    }
                } catch (err) {
                    throw new Error('Número de seguimiento no encontrado')
                }
            } else {
                throw new Error('Formato inválido. Usa el ID del pedido o número de seguimiento')
            }
        } catch (err) {
            console.error('Error searching order:', err)
            setError(err.message)
            setLoading(false)
        }
    }

    // Seleccionar una orden de la lista
    const handleSelectOrder = (order) => {
        setSelectedOrderId(order.id)
        loadOrderTracking(order.id)
    }

    // Calcular progreso del seguimiento
    const getProgressSteps = () => {
        const steps = [
            { key: 'RECEIVED', label: 'Pedido Recibido', icon: 'task_alt' },
            { key: 'PREPARING', label: 'En Preparación', icon: 'inventory_2' },
            { key: 'TRANSIT', label: 'En Tránsito', icon: 'local_shipping' },
            { key: 'DELIVERED', label: 'Entregado', icon: 'package_2' }
        ]

        const currentStatus = tracking?.status || 'RECEIVED'
        let currentIndex = steps.findIndex(s => s.key === currentStatus)
        if (currentIndex === -1) currentIndex = 0

        return steps.map((step, index) => ({
            ...step,
            completed: index <= currentIndex,
            active: index === currentIndex
        }))
    }

    const formatDate = (date) => {
        if (!date) return 'Pendiente'
        return new Date(date).toLocaleDateString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusBadge = (status) => {
        const statusMap = {
            'PENDING': { label: 'Pendiente', color: 'bg-yellow-500' },
            'PAID': { label: 'Pagado', color: 'bg-blue-500' },
            'CANCELLED': { label: 'Cancelado', color: 'bg-red-500' },
            'DELIVERED': { label: 'Entregado', color: 'bg-green-500' }
        }
        const info = statusMap[status] || { label: status, color: 'bg-gray-500' }
        return (
            <span className={`${info.color} text-white px-2 py-1 text-xs font-bold uppercase rounded`}>
                {info.label}
            </span>
        )
    }

    // Mostrar loading mientras verifica autenticación
    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-500">Verificando autenticación...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    const progressSteps = getProgressSteps()
    const currentStepIndex = progressSteps.findIndex(s => s.active)

    return (
        <div className="max-w-[1280px] mx-auto px-8 py-12">
            <h1 className="text-4xl font-bold text-primary-container mb-2">Seguimiento de Pedidos</h1>
            <p className="text-lg text-outline mb-8">Consulta el estado de tus pedidos en tiempo real</p>

            {/* Buscador de pedido */}
            <div className="bg-white border border-outline-variant rounded-lg p-6 mb-8">
                <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                    <Icon name="search" />
                    Buscar pedido específico
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Ingresa el ID del pedido o número de seguimiento"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-3 border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearchOrder()}
                    />
                    <button
                        onClick={handleSearchOrder}
                        disabled={loading}
                        className="bg-[#FC9430] text-white px-6 py-3 font-bold uppercase rounded-lg hover:bg-[#e0852b] transition-colors disabled:opacity-50"
                    >
                        Buscar Pedido
                    </button>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                    Puedes buscar por ID del pedido (UUID) o por número de seguimiento (formato: ELD-YYYYMMDD-XXXXXXXX-XXX)
                </p>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex items-center gap-2">
                        <Icon name="error" className="text-red-500" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Panel izquierdo - Lista de pedidos del usuario */}
                <div className="lg:col-span-4">
                    <div className="bg-white border border-outline-variant rounded-lg shadow-sm sticky top-32">
                        <div className="p-4 border-b bg-surface-container-low">
                            <h2 className="font-bold text-primary uppercase flex items-center gap-2">
                                <Icon name="receipt_long" />
                                Mis Pedidos
                            </h2>
                        </div>

                        <div className="max-h-[500px] overflow-y-auto">
                            {loading && !selectedOrder ? (
                                <div className="p-8 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                    <p className="text-sm text-gray-500 mt-2">Cargando pedidos...</p>
                                </div>
                            ) : userOrders.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Icon name="inbox" className="text-4xl text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">No tienes pedidos aún</p>
                                    <Link to="/catalogo" className="mt-4 inline-block text-[#FC9430] text-sm font-bold uppercase hover:underline">
                                        Comenzar a comprar
                                    </Link>
                                </div>
                            ) : (
                                userOrders.map(order => (
                                    <button
                                        key={order.id}
                                        onClick={() => handleSelectOrder(order)}
                                        className={`w-full p-4 text-left border-b hover:bg-gray-50 transition-colors ${selectedOrderId === order.id ? 'bg-primary/5 border-l-4 border-primary' : ''
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-primary text-sm font-mono">
                                                {order.id.slice(-8).toUpperCase()}
                                            </span>
                                            {getStatusBadge(order.status)}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Fecha: {new Date(order.createdAt).toLocaleDateString('es-CL')}
                                        </p>
                                        <p className="text-sm font-bold text-[#FC9430] mt-2">
                                            ${(parseFloat(order.total) || 0).toLocaleString()} CLP
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {order.items?.length || 0} productos
                                        </p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Panel derecho - Detalle del pedido seleccionado */}
                <div className="lg:col-span-8">
                    {!selectedOrder ? (
                        <div className="bg-white border border-outline-variant rounded-lg p-12 text-center">
                            <Icon name="package_search" className="text-6xl text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-primary mb-2">Selecciona un pedido</h3>
                            <p className="text-gray-500">Elige un pedido de la lista para ver su seguimiento</p>
                        </div>
                    ) : loading ? (
                        <div className="bg-white border border-outline-variant rounded-lg p-12 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-gray-500">Cargando detalles del pedido...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Header del pedido */}
                            <div className="bg-white border border-outline-variant rounded-lg p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-primary mb-1 font-mono">
                                            {selectedOrder.id.slice(-8).toUpperCase()}
                                        </h2>
                                        <p className="text-gray-500">
                                            Número de seguimiento: {tracking?.trackingNumber || 'Generando...'}
                                        </p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full text-white font-bold ${tracking?.status === 'Entregado' ? 'bg-green-500' :
                                        tracking?.status === 'En Tránsito' ? 'bg-orange-500' :
                                            tracking?.status === 'En Preparación' ? 'bg-blue-500' : 'bg-yellow-500'
                                        }`}>
                                        {tracking?.status || 'Pedido Recibido'}
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-sm text-gray-500">
                                        Fecha del pedido: {new Date(selectedOrder.createdAt).toLocaleString('es-CL')}
                                    </p>
                                </div>
                            </div>

                            {/* Timeline de progreso */}
                            {tracking && (
                                <div className="bg-white border border-outline-variant rounded-lg p-6">
                                    <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
                                        <Icon name="timeline" />
                                        Estado del Pedido
                                    </h3>

                                    <div className="relative">
                                        <div className="hidden md:block absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full z-0">
                                            <div
                                                className="h-1 bg-[#FC9430] rounded-full transition-all duration-500"
                                                style={{ width: `${(currentStepIndex / (progressSteps.length - 1)) * 100}%` }}
                                            ></div>
                                        </div>

                                        <div className="md:hidden absolute left-6 top-0 bottom-0 w-1 bg-gray-200 rounded-full z-0">
                                            <div
                                                className="w-1 bg-[#FC9430] rounded-full transition-all duration-500"
                                                style={{ height: `${(currentStepIndex / (progressSteps.length - 1)) * 100}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-4 md:gap-0">
                                            {progressSteps.map((step, index) => (
                                                <div key={step.key} className="flex flex-row md:flex-col items-center gap-3 md:gap-2 w-full md:w-auto">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${step.completed
                                                        ? 'bg-[#FC9430] text-white ring-4 ring-[#FC9430]/30'
                                                        : 'bg-gray-200 text-gray-400'
                                                        }`}>
                                                        <Icon name={step.icon} className="text-xl" />
                                                    </div>
                                                    <div className="text-center md:text-left">
                                                        <span className={`text-xs font-bold uppercase block ${step.completed ? 'text-primary' : 'text-gray-400'
                                                            }`}>
                                                            {step.label}
                                                        </span>
                                                        {step.active && step.completed && (
                                                            <span className="text-[10px] text-green-600 flex items-center gap-1 mt-1">
                                                                <Icon name="check_circle" className="text-[10px]" />
                                                                Completado
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Información de despacho */}
                            {tracking && (
                                <div className="bg-white border border-outline-variant rounded-lg p-6">
                                    <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                                        <Icon name="local_shipping" />
                                        Información de Despacho
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold">Transportista</p>
                                            <p className="font-semibold">
                                                {tracking.carrier === 'externo' ? tracking.carrierName || 'Empresa externa' : 'Envío Propio'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold">N° Seguimiento</p>
                                            <p className="font-semibold font-mono">{tracking.trackingNumber}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold">Fecha estimada de entrega</p>
                                            <p className="font-semibold text-[#FC9430]">
                                                {tracking.estimatedDelivery ? new Date(tracking.estimatedDelivery).toLocaleDateString('es-CL') : 'Por confirmar'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-bold">Ubicación actual</p>
                                            <p className="font-semibold">
                                                {tracking.trackingHistory?.slice(-1)[0]?.location || 'En proceso'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Historial de seguimiento */}
                            {tracking?.trackingHistory && tracking.trackingHistory.length > 0 && (
                                <div className="bg-white border border-outline-variant rounded-lg p-6">
                                    <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                                        <Icon name="history" />
                                        Historial de Seguimiento
                                    </h3>
                                    <div className="space-y-4">
                                        {[...tracking.trackingHistory].reverse().map((event, index) => (
                                            <div key={index} className="flex gap-3 pb-3 border-b last:border-0">
                                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Icon name="check_circle" className="text-primary text-sm" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex flex-wrap justify-between items-start gap-2">
                                                        <p className="font-bold text-primary">{event.status}</p>
                                                        <p className="text-xs text-gray-400">{formatDate(event.timestamp)}</p>
                                                    </div>
                                                    <p className="text-sm text-gray-600">{event.description}</p>
                                                    <p className="text-xs text-gray-400 mt-1">📍 {event.location}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Resumen de productos */}
                            <div className="bg-white border border-outline-variant rounded-lg p-6">
                                <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                                    <Icon name="shopping_bag" />
                                    Productos del Pedido
                                </h3>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                                            <div>
                                                <p className="font-medium">{item.product?.name || 'Producto'}</p>
                                                <p className="text-xs text-gray-400">
                                                    Cantidad: {item.quantity} | Ref: {item.product?.reference || 'N/A'}
                                                </p>
                                            </div>
                                            <p className="font-bold text-primary">${(parseFloat(item.subtotal) || 0).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                    <span className="font-bold text-lg text-primary">Total</span>
                                    <span className="font-bold text-2xl text-[#FC9430]">${(parseFloat(selectedOrder.total) || 0).toLocaleString()} CLP</span>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex gap-4">
                                <Link
                                    to="/catalogo"
                                    className="flex-1 bg-[#FC9430] text-white py-3 font-bold uppercase text-center rounded-lg hover:bg-[#e0852b] transition-colors"
                                >
                                    <Icon name="shopping_cart" className="text-sm inline mr-2" />
                                    Seguir comprando
                                </Link>
                                <Link
                                    to={`/factura/${selectedOrder.id}`}
                                    className="flex-1 border-2 border-primary text-primary py-3 font-bold uppercase text-center rounded-lg hover:bg-primary/5 transition-colors"
                                >
                                    <Icon name="receipt" className="text-sm inline mr-2" />
                                    Ver factura
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}