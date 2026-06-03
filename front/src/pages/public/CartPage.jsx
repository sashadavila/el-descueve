// src/pages/public/CartPage.jsx
import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../../components/ui/Icon'

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, updateEmbroidery, getTotalPrice } = useCart()
    const { isAuthenticated } = useAuth()

    const handleRemoveEmbroidery = (productId) => {
        if (confirm('¿Deseas eliminar la personalización de bordado de este producto?')) {
            updateEmbroidery(productId, null)
        }
    }

    if (cart.length === 0) {
        return (
            <div className="max-w-[1280px] mx-auto px-8 py-20 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="shopping_bag" className="text-5xl text-gray-400" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Carrito Vacío</h1>
                <p className="text-on-surface-variant mb-8">No tienes productos en tu carrito</p>
                <Link to="/catalogo" className="bg-[#FC9430] text-white px-8 py-3 font-bold uppercase inline-block hover:bg-[#e0852b] transition-colors rounded">
                    Ir al Catálogo
                </Link>
            </div>
        )
    }

    const subtotal = getTotalPrice()
    const shippingCost = 4500
    const total = subtotal + shippingCost

    return (
        <div className="max-w-[1280px] mx-auto px-8 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Carrito de Compras</h1>
            <p className="text-on-surface-variant mb-8">Pedido mínimo: 10 unidades combinables (mezcla de tallas y colores)</p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-4">
                    {cart.map(item => (
                        <div key={item.id} className="bg-white border border-outline-variant rounded-lg p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow">
                            <div className="w-32 h-32 bg-surface-container flex-shrink-0 rounded-lg overflow-hidden">
                                <img
                                    src={item.image || 'https://via.placeholder.com/128'}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/128' }}
                                />
                            </div>

                            <div className="flex-grow">
                                <div className="flex justify-between items-start flex-wrap gap-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-primary">{item.name}</h3>
                                        <p className="text-on-surface-variant text-sm uppercase mt-1">Ref: {item.reference}</p>
                                        {item.selectedColor && (
                                            <p className="text-xs text-gray-500 mt-1">Color seleccionado:
                                                <span className="inline-block w-3 h-3 rounded-full ml-1 align-middle" style={{ backgroundColor: item.selectedColor }}></span>
                                            </p>
                                        )}
                                        {item.selectedSize && (
                                            <p className="text-xs text-gray-500">Talla: {item.selectedSize}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-outline hover:text-red-500 transition-colors p-2"
                                        title="Eliminar producto"
                                    >
                                        <Icon name="delete" className="text-xl" />
                                    </button>
                                </div>

                                {item.embroidery && (
                                    <div className="mt-3 p-3 bg-orange-50 rounded-lg border-l-4 border-[#FC9430]">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-primary uppercase flex items-center gap-1">
                                                    <Icon name="brush" className="text-sm" />
                                                    Bordado Personalizado
                                                </p>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    <strong>Posiciones:</strong> {item.embroidery.positions?.join(', ')}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    <strong>Puntadas:</strong> {item.embroidery.maxStitches?.toLocaleString()} |
                                                    <strong> Colores:</strong> {item.embroidery.colors}
                                                </p>
                                                {item.embroidery.specialInstructions && (
                                                    <p className="text-xs text-gray-500 mt-1 italic">
                                                        <strong>Instrucciones:</strong> "{item.embroidery.specialInstructions}"
                                                    </p>
                                                )}
                                                {item.embroidery.logoFilename && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        <Icon name="attach_file" className="text-xs inline" /> {item.embroidery.logoFilename}
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleRemoveEmbroidery(item.id)}
                                                className="text-xs text-red-500 hover:text-red-700 transition-colors ml-2"
                                                title="Eliminar bordado"
                                            >
                                                <Icon name="close" className="text-sm" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 flex flex-wrap justify-between items-end gap-4">
                                    <div className="flex items-center border border-outline rounded-lg">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - (item.minOrder || 10))}
                                            className="px-3 py-1 hover:bg-surface-container transition-colors rounded-l"
                                        >
                                            <Icon name="remove" className="text-sm" />
                                        </button>
                                        <span className="px-4 font-bold min-w-[60px] text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + (item.minOrder || 10))}
                                            className="px-3 py-1 hover:bg-surface-container transition-colors rounded-r"
                                        >
                                            <Icon name="add" className="text-sm" />
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-on-surface-variant text-sm">Unitario: ${item.price.toLocaleString()}</p>
                                        <p className="text-xl font-bold text-[#FC9430]">${(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="bg-primary-container/10 border-l-4 border-[#FC9430] p-4 rounded">
                        <div className="flex gap-3">
                            <Icon name="info" className="text-[#FC9430]" />
                            <div>
                                <p className="text-sm font-bold text-primary uppercase">Pedido mínimo cumplido</p>
                                <p className="text-xs text-on-surface-variant">Tu pedido supera las 10 unidades mínimas requeridas.</p>
                            </div>
                        </div>
                    </div>

                    <Link to="/catalogo" className="inline-flex items-center gap-2 font-bold text-primary hover:text-[#FC9430] transition-colors">
                        <Icon name="arrow_back" className="text-sm" />
                        SEGUIR COMPRANDO
                    </Link>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6 sticky top-32">
                        <h2 className="text-2xl font-bold text-primary mb-4">Resumen del Pedido</h2>

                        <div className="space-y-3 border-b border-outline-variant pb-4 mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-bold">${subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Envío (La Serena - Calbuco)</span>
                                <span className="font-bold">${shippingCost.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-green-600">
                                <span>Bordado de logo</span>
                                <span className="font-bold">Incluido</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xl font-bold text-primary uppercase">Total</span>
                            <span className="text-2xl font-bold text-[#FC9430]">${total.toLocaleString()}</span>
                        </div>

                        {!isAuthenticated ? (
                            <Link
                                to="/login"
                                state={{ from: '/checkout' }}
                                className="w-full h-14 bg-[#FC9430] text-white font-bold uppercase tracking-widest rounded-lg hover:bg-[#e0852b] transition-all flex items-center justify-center gap-2"
                            >
                                <Icon name="login" className="text-sm" />
                                Iniciar Sesión para Comprar
                            </Link>
                        ) : (
                            <Link
                                to="/checkout"
                                className="w-full h-14 bg-[#FC9430] text-white font-bold uppercase tracking-widest rounded-lg hover:bg-[#e0852b] transition-all flex items-center justify-center gap-2"
                            >
                                <Icon name="payments" className="text-sm" />
                                PROCEDER AL PAGO
                            </Link>
                        )}

                        <div className="mt-6 pt-4 border-t border-outline-variant text-center">
                            <p className="text-xs text-gray-500 mb-2">Medios de pago aceptados</p>
                            <div className="flex justify-center gap-4">
                                <span className="text-xs font-bold text-gray-600">Transferencia</span>
                                <span className="text-xs font-bold text-gray-600">Depósito</span>
                                <span className="text-xs font-bold text-gray-600">Factura 30 días</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}