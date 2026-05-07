import { useState } from 'react'
import { useCart } from '../../hooks/useCart'
import { useNavigate } from 'react-router-dom'

export default function CheckoutPage() {
    const { cart, getTotalPrice, clearCart } = useCart()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        region: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        // Simular envío
        clearCart()
        navigate('/confirmacion')
    }

    return (
        <div className="max-w-[1280px] mx-auto px-8 py-8">
            <h1 className="text-4xl font-bold text-primary mb-8">Finalizar Cotización</h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7">
                    <form onSubmit={handleSubmit}>
                        {/* Información de contacto */}
                        <div className="bg-white border border-outline-variant p-6 mb-6">
                            <h2 className="text-xl font-bold text-primary mb-4">Información de Contacto</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold uppercase">Nombre *</label>
                                    <input
                                        required
                                        className="w-full border border-outline p-2 focus:ring-2 focus:ring-primary outline-none"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold uppercase">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full border border-outline p-2 focus:ring-2 focus:ring-primary outline-none"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold uppercase">Teléfono *</label>
                                    <input
                                        required
                                        className="w-full border border-outline p-2 focus:ring-2 focus:ring-primary outline-none"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-[#FC9430] text-white py-4 font-bold uppercase hover:bg-[#e0852b] transition-all">
                            Enviar Cotización
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-5">
                    <div className="bg-white border-2 border-primary p-6 sticky top-32">
                        <h3 className="text-xl font-bold text-primary mb-4">Resumen de Cotización</h3>
                        {cart.map(item => (
                            <div key={item.id} className="flex gap-3 mb-4">
                                <div className="w-20 h-20 bg-surface border flex-shrink-0">
                                    <img src={item.image} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="font-bold uppercase text-sm">{item.name}</p>
                                    <p className="text-sm">Cantidad: {item.quantity}</p>
                                    <p className="font-bold text-primary">${(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                        <div className="border-t pt-4">
                            <div className="flex justify-between font-bold text-xl">
                                <span>Total</span>
                                <span>${(getTotalPrice() + 4500).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}