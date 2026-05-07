import { useParams } from 'react-router-dom'

export default function OrderTrackingPage() {
    const { orderId } = useParams()

    const steps = [
        { label: 'Pedido Recibido', icon: 'task_alt', active: true, completed: true },
        { label: 'En Preparación', icon: 'inventory_2', active: true, completed: true },
        { label: 'En Tránsito', icon: 'local_shipping', active: true, completed: false },
        { label: 'Entregado', icon: 'package_2', active: false, completed: false }
    ]

    return (
        <div className="max-w-[1280px] mx-auto px-8 py-12">
            <h1 className="text-4xl font-bold text-primary-container mb-2">Seguimiento de tu Pedido {orderId}</h1>
            <p className="text-lg text-outline mb-8">Logística y despacho de tu pedido corporativo en tiempo real.</p>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    {/* Timeline */}
                    <div className="bg-white border p-6">
                        <div className="flex justify-between items-center mb-8">
                            {steps.map((step, index) => (
                                <div key={step.label} className="flex flex-col items-center flex-1 text-center relative">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 z-10 ${step.active ? 'bg-primary-container text-white' : 'bg-surface-container-highest text-outline'
                                        }`}>
                                        <span className="material-symbols-outlined">{step.icon}</span>
                                    </div>
                                    <span className={`text-xs uppercase font-bold ${step.active ? 'text-primary-container' : 'text-outline'
                                        }`}>{step.label}</span>
                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-6 left-[50%] w-full h-1 bg-surface-container-highest -z-0"></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="bg-surface-container p-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-l-4 border-[#FC9430] mt-8">
                            <div>
                                <span className="text-xs uppercase text-outline block mb-1">TRANSPORTISTA</span>
                                <p className="text-xl font-bold text-primary-container">Chilexpress</p>
                            </div>
                            <div>
                                <span className="text-xs uppercase text-outline block mb-1">NÚMERO DE SEGUIMIENTO</span>
                                <p className="text-xl font-bold text-primary-container">987654321</p>
                            </div>
                            <div>
                                <span className="text-xs uppercase text-outline block mb-1">ENTREGA ESTIMADA</span>
                                <p className="text-xl font-bold text-[#FC9430] uppercase">24 de Mayo</p>
                            </div>
                        </div>
                    </div>

                    {/* Map placeholder */}
                    <div className="bg-white border overflow-hidden">
                        <div className="p-4 border-b">
                            <h2 className="font-bold text-primary-container uppercase flex items-center gap-2">
                                <span className="material-symbols-outlined">map</span>
                                Ubicación del pedido
                            </h2>
                        </div>
                        <div className="aspect-video w-full bg-slate-200 flex items-center justify-center">
                            <p className="text-slate-500">Mapa de seguimiento - Centro de Distribución Santiago</p>
                        </div>
                    </div>
                </div>

                <aside className="lg:col-span-4 space-y-6">
                    {/* Order Summary */}
                    <div className="bg-white border">
                        <div className="p-4 border-b bg-surface-container-low">
                            <h2 className="font-bold text-primary-container uppercase">Resumen del Pedido</h2>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>$243.500</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Envío (La Serena - Calbuco)</span>
                                <span>$4.500</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl pt-4 border-t">
                                <span>TOTAL</span>
                                <span>$248.000</span>
                            </div>
                        </div>
                    </div>

                    {/* Help */}
                    <div className="bg-primary-container text-white p-6">
                        <h3 className="text-xl font-bold mb-4 uppercase">¿Necesitas Ayuda?</h3>
                        <div className="space-y-4">
                            <a href="https://wa.me/56912345678" target="_blank" className="flex items-center gap-3 border border-white/30 hover:border-white p-4 transition-colors">
                                <span className="material-symbols-outlined">chat</span>
                                <span className="font-bold uppercase">Contactar por WhatsApp</span>
                            </a>
                        </div>
                    </div>

                    {/* Service area */}
                    <div className="bg-white border p-4 text-center">
                        <span className="material-symbols-outlined text-primary-container text-2xl">location_on</span>
                        <h4 className="font-bold uppercase text-primary-container text-sm mt-2">Zona de Atención</h4>
                        <p className="text-xs text-outline">Desde La Serena hasta Calbuco</p>
                    </div>
                </aside>
            </div>
        </div>
    )
}