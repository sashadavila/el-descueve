import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart()

    if (cart.length === 0) {
        return (
            <div className="max-w-[1280px] mx-auto px-8 py-20 text-center">
                <h1 className="text-4xl font-bold text-primary mb-4">Carrito Vacío</h1>
                <p className="text-on-surface-variant mb-8">No tienes productos en tu carrito</p>
                <Link to="/catalogo" className="bg-[#FC9430] text-white px-8 py-3 font-bold uppercase inline-block">
                    Ir al Catálogo
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-[1280px] mx-auto px-8 py-8">
            <h1 className="text-4xl font-bold text-primary-container mb-4">Carrito de Compras</h1>
            <p className="text-on-surface-variant mb-8">Pedido mínimo: 10 unidades combinables (mezcla de tallas y colores)</p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-4">
                    {cart.map(item => (
                        <div key={item.id} className="bg-white border border-outline-variant p-4 flex flex-col sm:flex-row gap-4">
                            <div className="w-32 h-32 bg-surface-container flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold text-primary">{item.name}</h3>
                                        <p className="text-on-surface-variant text-sm uppercase mt-1">Ref: {item.reference}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-outline hover:text-error">
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                                <div className="mt-4 flex flex-wrap justify-between items-end gap-4">
                                    <div className="flex items-center border border-outline rounded-lg">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 10)}
                                            className="px-3 py-1 hover:bg-surface-container transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">remove</span>
                                        </button>
                                        <span className="px-4 font-bold">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 10)}
                                            className="px-3 py-1 hover:bg-surface-container transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-sm">add</span>
                                        </button>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-on-surface-variant text-sm">Unitario: ${item.price.toLocaleString()}</p>
                                        <p className="text-xl font-bold text-primary-container">${(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="bg-primary-container/10 border-l-4 border-[#FC9430] p-4">
                        <div className="flex gap-3">
                            <span className="material-symbols-outlined text-[#FC9430]">info</span>
                            <div>
                                <p className="text-sm font-bold text-primary uppercase">Pedido mínimo cumplido</p>
                                <p className="text-xs text-on-surface-variant">Tu pedido supera las 10 unidades mínimas requeridas.</p>
                            </div>
                        </div>
                    </div>

                    <Link to="/catalogo" className="flex items-center gap-2 font-bold text-primary hover:underline">
                        <span className="material-symbols-outlined">arrow_back</span>
                        SEGUIR COMPRANDO
                    </Link>
                </div>

                <div className="lg:col-span-4">
                    <div className="bg-surface-container-low border border-outline-variant p-4 sticky top-32">
                        <h2 className="text-2xl font-bold text-primary-container mb-4">Resumen del Pedido</h2>
                        <div className="space-y-2 border-b border-outline-variant pb-4 mb-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-bold">${getTotalPrice().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Envío (La Serena - Calbuco)</span>
                                <span className="font-bold">$4.500</span>
                            </div>
                            <div className="flex justify-between text-on-surface-variant">
                                <span>Bordado de logo</span>
                                <span className="font-bold">Incluido</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xl font-bold text-primary-container uppercase">Total</span>
                            <span className="text-2xl font-bold text-primary-container">${(getTotalPrice() + 4500).toLocaleString()}</span>
                        </div>
                        <Link
                            to="/checkout"
                            className="w-full h-14 bg-[#FC9430] text-white font-bold uppercase tracking-widest hover:bg-[#e0852b] transition-all flex items-center justify-center gap-2"
                        >
                            PAGAR
                            <span className="material-symbols-outlined">payments</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}