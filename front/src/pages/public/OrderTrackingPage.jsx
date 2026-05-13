import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import { useAuth } from '../../hooks/useAuth'
import { mockOrders, getOrderById } from '../../data/mockOrders'

export default function OrderTrackingPage() {
    const { orderId } = useParams()
    const navigate = useNavigate()
    const { isAuthenticated, loading: authLoading } = useAuth()
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredOrders, setFilteredOrders] = useState(mockOrders)

    // Redirigir si no está autenticado
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login', { state: { from: '/seguimiento' } })
        }
    }, [isAuthenticated, authLoading, navigate])

    // Cargar el pedido inicial si viene por URL
    useEffect(() => {
        if (orderId && isAuthenticated) {
            const order = getOrderById(orderId)
            if (order) {
                setSelectedOrder(order)
            }
        }
    }, [orderId, isAuthenticated])

    // Filtrar pedidos por búsqueda
    useEffect(() => {
        if (searchTerm) {
            const filtered = mockOrders.filter(order =>
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredOrders(filtered)
        } else {
            setFilteredOrders(mockOrders)
        }
    }, [searchTerm])

    const handleSelectOrder = (order) => {
        setSelectedOrder(order)
        navigate(`/seguimiento/${order.id}`, { replace: true })
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500'
            case 'preparation': return 'bg-blue-500'
            case 'transit': return 'bg-orange-500'
            case 'delivered': return 'bg-green-500'
            default: return 'bg-gray-500'
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return 'Pedido Recibido'
            case 'preparation': return 'En Preparación'
            case 'transit': return 'En Tránsito'
            case 'delivered': return 'Entregado'
            default: return 'Desconocido'
        }
    }

    // Mostrar loading mientras verifica autenticación
    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-500">Cargando...</p>
                </div>
            </div>
        )
    }

    // No mostrar nada si no está autenticado (redirige automáticamente)
    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="max-w-[1280px] mx-auto px-8 py-12">
            <h1 className="text-4xl font-bold text-primary-container mb-2">Seguimiento de Pedidos</h1>
            <p className="text-lg text-outline mb-8">Consulta el estado de tus pedidos en tiempo real</p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Panel izquierdo - Lista de pedidos */}
                <div className="lg:col-span-4">
                    <div className="bg-white border border-outline-variant rounded-lg shadow-sm sticky top-32">
                        <div className="p-4 border-b bg-surface-container-low">
                            <h2 className="font-bold text-primary uppercase flex items-center gap-2">
                                <Icon name="receipt_long" />
                                Mis Pedidos
                            </h2>
                        </div>

                        {/* Buscador */}
                        <div className="p-4 border-b">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <Icon name="search" className="text-slate-400 text-sm" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Buscar por N° pedido o cliente..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-outline-variant focus:ring-1 focus:ring-primary outline-none rounded"
                                />
                            </div>
                        </div>

                        {/* Lista de pedidos */}
                        <div className="max-h-[500px] overflow-y-auto">
                            {filteredOrders.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Icon name="search_off" className="text-4xl text-slate-300 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">No se encontraron pedidos</p>
                                </div>
                            ) : (
                                filteredOrders.map(order => (
                                    <button
                                        key={order.id}
                                        onClick={() => handleSelectOrder(order)}
                                        className={`w-full p-4 text-left border-b hover:bg-gray-50 transition-colors ${selectedOrder?.id === order.id ? 'bg-primary/5 border-l-4 border-primary' : ''
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-primary text-sm">{order.id}</span>
                                            <span className={`text-xs px-2 py-1 rounded-full text-white ${getStatusColor(order.status)}`}>
                                                {getStatusText(order.status)}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">{order.customer.name}</p>
                                        <p className="text-xs text-gray-400">Fecha: {order.date}</p>
                                        <p className="text-xs font-bold text-primary mt-1">${order.total.toLocaleString()} CLP</p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Panel derecho - Detalle del pedido */}
                <div className="lg:col-span-8">
                    {!selectedOrder ? (
                        <div className="bg-white border border-outline-variant rounded-lg p-12 text-center">
                            <Icon name="package_search" className="text-6xl text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-primary mb-2">Selecciona un pedido</h3>
                            <p className="text-gray-500">Elige un pedido de la lista para ver su seguimiento</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Header del pedido */}
                            <div className="bg-white border border-outline-variant rounded-lg p-6">
                                <div className="flex justify-between items-start flex-wrap gap-4">
                                    <div>
                                        <h2 className="text-2xl font-bold text-primary mb-1">{selectedOrder.id}</h2>
                                        <p className="text-gray-500">Fecha: {selectedOrder.date}</p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full text-white font-bold ${getStatusColor(selectedOrder.status)}`}>
                                        {getStatusText(selectedOrder.status)}
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <h3 className="font-bold text-primary mb-2">Cliente</h3>
                                    <p className="text-gray-700">{selectedOrder.customer.name}</p>
                                    <p className="text-sm text-gray-500">{selectedOrder.customer.email}</p>
                                    <p className="text-sm text-gray-500">{selectedOrder.customer.phone}</p>
                                </div>
                            </div>

                            {/* Timeline de seguimiento - Barra de estado mejorada */}
                            <div className="bg-white border border-outline-variant rounded-lg p-6">
                                <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
                                    <Icon name="timeline" />
                                    Estado del Pedido
                                </h3>

                                <div className="relative">
                                    {/* Línea de progreso */}
                                    <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full z-0">
                                        <div
                                            className="h-1 bg-[#FC9430] rounded-full transition-all duration-500"
                                            style={{
                                                width: selectedOrder.status === 'pending' ? '0%' :
                                                    selectedOrder.status === 'preparation' ? '33%' :
                                                        selectedOrder.status === 'transit' ? '66%' :
                                                            selectedOrder.status === 'delivered' ? '100%' : '0%'
                                            }}
                                        ></div>
                                    </div>

                                    <div className="flex justify-between items-center relative z-10">
                                        {/* Paso 1 - Pedido Recibido */}
                                        <div className="flex flex-col items-center text-center flex-1">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${selectedOrder.status === 'pending' || selectedOrder.status === 'preparation' || selectedOrder.status === 'transit' || selectedOrder.status === 'delivered'
                                                    ? 'bg-[#FC9430] text-white ring-4 ring-[#FC9430]/30'
                                                    : 'bg-gray-200 text-gray-400'
                                                }`}>
                                                <Icon name="task_alt" className="text-xl" />
                                            </div>
                                            <span className={`text-xs font-bold uppercase ${selectedOrder.status === 'pending' || selectedOrder.status === 'preparation' || selectedOrder.status === 'transit' || selectedOrder.status === 'delivered'
                                                    ? 'text-primary'
                                                    : 'text-gray-400'
                                                }`}>
                                                Pedido Recibido
                                            </span>
                                            {selectedOrder.shipping.history[0]?.date && (
                                                <p className="text-[10px] text-gray-400 mt-1">{selectedOrder.shipping.history[0].date}</p>
                                            )}
                                        </div>

                                        {/* Paso 2 - En Preparación */}
                                        <div className="flex flex-col items-center text-center flex-1">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${selectedOrder.status === 'preparation' || selectedOrder.status === 'transit' || selectedOrder.status === 'delivered'
                                                    ? 'bg-[#FC9430] text-white ring-4 ring-[#FC9430]/30'
                                                    : 'bg-gray-200 text-gray-400'
                                                }`}>
                                                <Icon name="inventory_2" className="text-xl" />
                                            </div>
                                            <span className={`text-xs font-bold uppercase ${selectedOrder.status === 'preparation' || selectedOrder.status === 'transit' || selectedOrder.status === 'delivered'
                                                    ? 'text-primary'
                                                    : 'text-gray-400'
                                                }`}>
                                                En Preparación
                                            </span>
                                            {selectedOrder.shipping.history[1]?.date && (
                                                <p className="text-[10px] text-gray-400 mt-1">{selectedOrder.shipping.history[1].date}</p>
                                            )}
                                        </div>

                                        {/* Paso 3 - En Tránsito */}
                                        <div className="flex flex-col items-center text-center flex-1">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${selectedOrder.status === 'transit' || selectedOrder.status === 'delivered'
                                                    ? 'bg-[#FC9430] text-white ring-4 ring-[#FC9430]/30'
                                                    : 'bg-gray-200 text-gray-400'
                                                }`}>
                                                <Icon name="local_shipping" className="text-xl" />
                                            </div>
                                            <span className={`text-xs font-bold uppercase ${selectedOrder.status === 'transit' || selectedOrder.status === 'delivered'
                                                    ? 'text-primary'
                                                    : 'text-gray-400'
                                                }`}>
                                                En Tránsito
                                            </span>
                                            {selectedOrder.shipping.history[2]?.date && (
                                                <p className="text-[10px] text-gray-400 mt-1">{selectedOrder.shipping.history[2].date}</p>
                                            )}
                                        </div>

                                        {/* Paso 4 - Entregado */}
                                        <div className="flex flex-col items-center text-center flex-1">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${selectedOrder.status === 'delivered'
                                                    ? 'bg-green-500 text-white ring-4 ring-green-500/30'
                                                    : 'bg-gray-200 text-gray-400'
                                                }`}>
                                                <Icon name="package_2" className="text-xl" />
                                            </div>
                                            <span className={`text-xs font-bold uppercase ${selectedOrder.status === 'delivered'
                                                    ? 'text-green-600'
                                                    : 'text-gray-400'
                                                }`}>
                                                Entregado
                                            </span>
                                            {selectedOrder.shipping.history[3]?.date && (
                                                <p className="text-[10px] text-gray-400 mt-1">{selectedOrder.shipping.history[3].date}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Información de despacho */}
                            <div className="bg-white border border-outline-variant rounded-lg p-6">
                                <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                                    <Icon name="local_shipping" />
                                    Información de Despacho
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Transportista</p>
                                        <p className="font-semibold">{selectedOrder.shipping.carrier}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">N° Seguimiento</p>
                                        <p className="font-semibold">{selectedOrder.shipping.trackingNumber}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-xs text-gray-500 uppercase font-bold">Dirección de entrega</p>
                                        <p className="text-sm">{selectedOrder.shipping.address}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">
                                            {selectedOrder.status === 'delivered' ? 'Fecha de entrega' : 'Entrega estimada'}
                                        </p>
                                        <p className="font-semibold text-[#FC9430]">
                                            {selectedOrder.status === 'delivered'
                                                ? selectedOrder.shipping.deliveredDate
                                                : selectedOrder.shipping.estimatedDelivery}
                                        </p>
                                    </div>
                                </div>

                                {/* Última actualización */}
                                <div className="mt-4 pt-4 border-t">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-bold">Última actualización:</span> {selectedOrder.shipping.lastUpdate}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-bold">Ubicación actual:</span> {selectedOrder.shipping.currentLocation}
                                    </p>
                                </div>
                            </div>

                            {/* Historial del pedido */}
                            <div className="bg-white border border-outline-variant rounded-lg p-6">
                                <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                                    <Icon name="history" />
                                    Historial del Pedido
                                </h3>
                                <div className="space-y-3">
                                    {selectedOrder.shipping.history.map((event, index) => (
                                        <div key={index} className={`flex items-start gap-3 pb-3 border-b last:border-0 ${!event.completed ? 'opacity-50' : ''}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${event.completed ? 'bg-primary/10' : 'bg-gray-100'
                                                }`}>
                                                <Icon name={event.completed ? "check_circle" : "pending"} className={`text-sm ${event.completed ? 'text-primary' : 'text-gray-400'}`} />
                                            </div>
                                            <div className="flex-1">
                                                <p className={`font-semibold ${event.completed ? 'text-primary' : 'text-gray-400'}`}>{event.status}</p>
                                                {event.date ? (
                                                    <>
                                                        <p className="text-sm text-gray-500">{event.date}</p>
                                                        <p className="text-xs text-gray-400">Ubicación: {event.location}</p>
                                                    </>
                                                ) : (
                                                    <p className="text-xs text-gray-400 italic">Próximamente...</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Resumen de productos */}
                            <div className="bg-white border border-outline-variant rounded-lg p-6">
                                <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                                    <Icon name="shopping_bag" />
                                    Productos del Pedido
                                </h3>
                                <div className="space-y-4">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-primary">{item.name}</h4>
                                                <p className="text-xs text-gray-500">Ref: {item.reference}</p>
                                                <div className="flex justify-between items-center mt-2">
                                                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                                                    <p className="font-bold text-primary">${item.subtotal.toLocaleString()} CLP</p>
                                                </div>
                                                <p className="text-xs text-gray-400">Unitario: ${item.price.toLocaleString()} CLP</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                    <span className="font-bold text-lg text-primary">Total</span>
                                    <span className="font-bold text-2xl text-[#FC9430]">${selectedOrder.total.toLocaleString()} CLP</span>
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex gap-4">
                                <Link
                                    to="/catalogo"
                                    className="flex-1 bg-primary text-white py-3 font-bold uppercase text-center rounded-lg hover:bg-primary/80 transition-colors"
                                >
                                    Comprar de nuevo
                                </Link>
                                <a
                                    href={`https://wa.me/56912345678?text=Hola,%20tengo%20una%20consulta%20sobre%20mi%20pedido%20${selectedOrder.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 border-2 border-[#25D366] text-[#25D366] py-3 font-bold uppercase text-center rounded-lg hover:bg-[#25D366] hover:text-white transition-colors"
                                >
                                    Consultar por WhatsApp
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input para buscar pedido por número */}
            <div className="mt-8 pt-8 border-t border-outline-variant">
                <div className="bg-surface-container-low p-6 rounded-lg max-w-2xl mx-auto text-center">
                    <h3 className="font-bold text-primary mb-2">¿No encuentras tu pedido?</h3>
                    <p className="text-sm text-gray-600 mb-4">Ingresa el número de pedido manualmente</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Ej: ELD-10254"
                            className="flex-1 px-4 py-2 border border-outline-variant rounded focus:ring-1 focus:ring-primary outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            onClick={() => {
                                const order = getOrderById(searchTerm.toUpperCase())
                                if (order) {
                                    handleSelectOrder(order)
                                } else {
                                    alert('No se encontró el pedido. Verifica el número ingresado.')
                                }
                            }}
                            className="bg-[#FC9430] text-white px-6 py-2 font-bold uppercase rounded hover:bg-[#e0852b] transition-colors"
                        >
                            Buscar Pedido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}