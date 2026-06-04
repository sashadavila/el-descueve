// src/pages/public/ConfirmacionCompraPage.jsx
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../../components/ui/Icon'
import api from '../../config/api'

export default function OrderConfirmationPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const orderId = location.state?.orderId

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login')
            return
        }

        const fetchOrder = async () => {
            if (!orderId) {
                setError('No se encontró el ID de la orden')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                const orderData = await api.orders.getById(orderId)
                setOrder(orderData)
            } catch (err) {
                console.error('Error fetching order:', err)
                setError(err.message || 'No se pudo cargar la información de la orden')
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [orderId, isAuthenticated, navigate])

    // Calcular valores
    const subtotal = order?.items?.reduce((sum, item) => sum + (parseFloat(item.subtotal) || 0), 0) || parseFloat(order?.total) || 0
    const shippingCost = 4500
    const iva = subtotal * 0.19
    const total = subtotal + shippingCost + iva

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-500">Cargando información de tu compra...</p>
                </div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="max-w-[1280px] mx-auto px-8 py-20 text-center">
                <Icon name="error" className="text-6xl text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-primary mb-4">Error al cargar la compra</h1>
                <p className="text-gray-600 mb-8">{error || 'No se pudo encontrar la información de tu compra.'}</p>
                <Link to="/catalogo" className="bg-[#FC9430] text-white px-6 py-3 font-bold uppercase inline-block hover:bg-[#e0852b] transition-colors rounded">
                    Volver al catálogo
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-[1280px] mx-auto px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 bg-white p-8 border border-slate-200 text-center rounded-lg">
                    <div className="w-24 h-24 bg-[#FC9430]/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#FC9430]">
                        <Icon name="check_circle" className="text-[#FC9430] text-6xl" />
                    </div>
                    <h1 className="text-4xl font-bold text-primary mb-2">¡Compra Confirmada!</h1>
                    <p className="text-2xl text-[#FC9430] mb-4 font-bold">
                        #{orderId ? orderId.slice(-8).toUpperCase() : 'ORDEN'}
                    </p>
                    <p className="text-lg text-gray-600 mb-8">
                        Hemos recibido tu compra correctamente. En breve recibirás un correo de confirmación.
                    </p>

                    {/* Detalle de productos */}
                    {order.items && order.items.length > 0 && (
                        <div className="text-left mb-8">
                            <h3 className="font-bold text-primary mb-4 text-lg">Productos Comprados</h3>
                            <div className="space-y-3">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center border-b pb-2">
                                        <div>
                                            <p className="font-medium">{item.product?.name || 'Producto'}</p>
                                            <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                        </div>
                                        <p className="font-bold text-primary">${(parseFloat(item.subtotal) || 0).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <Link
                            to={`/factura/${orderId}`}
                            className="bg-[#FC9430] text-white px-6 py-3 font-bold uppercase hover:bg-[#e0852b] transition-colors rounded flex items-center justify-center gap-2"
                        >
                            <Icon name="receipt" className="text-sm" />
                            Ver Factura
                        </Link>
                        <Link
                            to="/catalogo"
                            className="bg-white text-primary border-2 border-primary px-6 py-3 font-bold uppercase hover:bg-gray-50 transition-colors rounded flex items-center justify-center gap-2"
                        >
                            <Icon name="shopping_cart" className="text-sm" />
                            Seguir Comprando
                        </Link>
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                        <div className="bg-primary text-white p-4">
                            <h2 className="font-bold uppercase flex items-center gap-2">
                                <Icon name="receipt" className="text-sm" />
                                Resumen de Compra
                            </h2>
                        </div>
                        <div className="p-5 space-y-4">
                            {/* Número de orden */}
                            <div className="flex justify-between border-b pb-3">
                                <span className="text-gray-500">N° Orden</span>
                                <span className="font-bold text-primary">{orderId?.slice(-8).toUpperCase()}</span>
                            </div>

                            {/* Subtotal */}
                            <div className="flex justify-between">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium">${Math.round(subtotal).toLocaleString()}</span>
                            </div>

                            {/* Envío */}
                            <div className="flex justify-between">
                                <span className="text-gray-500">Envío (La Serena - Calbuco)</span>
                                <span className="font-medium">${shippingCost.toLocaleString()}</span>
                            </div>

                            {/* Bordado */}
                            <div className="flex justify-between text-green-600">
                                <span className="flex items-center gap-1">
                                    <Icon name="brush" className="text-sm" />
                                    Bordado de logo
                                </span>
                                <span className="font-bold">Incluido</span>
                            </div>

                            {/* Línea separadora */}
                            <div className="border-t border-dashed my-2"></div>

                            {/* IVA */}
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">IVA (19%)</span>
                                <span className="font-medium">${Math.round(iva).toLocaleString()}</span>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                                <span className="text-xl font-bold text-primary uppercase">Total</span>
                                <span className="text-2xl font-bold text-[#FC9430]">${Math.round(total).toLocaleString()} CLP</span>
                            </div>
                        </div>
                    </div>

                    {/* Información de contacto */}
                    <div className="bg-gray-50 border border-slate-200 rounded-lg p-5">
                        <h3 className="font-bold text-primary mb-3 flex items-center gap-2">
                            <Icon name="contact_support" className="text-sm" />
                            ¿Necesitas ayuda?
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                            Si tienes alguna pregunta sobre tu pedido, contáctanos:
                        </p>
                        <div className="space-y-2 text-sm">
                            <a href="mailto:ventas@eldescuevee.cl" className="flex items-center gap-2 text-primary hover:text-[#FC9430] transition-colors">
                                <Icon name="mail" className="text-sm" />
                                ventas@eldescuevee.cl
                            </a>
                            <a href="https://wa.me/56987654321" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#25D366] hover:opacity-80 transition-colors">
                                <Icon name="chat" className="text-sm" />
                                +56 9 8765 4321 (WhatsApp)
                            </a>
                        </div>
                    </div>

                    {/* Tiempo estimado */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                        <div className="flex items-center gap-3">
                            <Icon name="schedule" className="text-blue-500 text-2xl" />
                            <div>
                                <h4 className="font-bold text-blue-700">Tiempo estimado de entrega</h4>
                                <p className="text-sm text-blue-600">5-7 días hábiles</p>
                                <p className="text-xs text-blue-500 mt-1">* Productos con bordado: +2-3 días adicionales</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}