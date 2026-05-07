import { Link } from 'react-router-dom'

export default function OrderConfirmationPage() {
    return (
        <div className="max-w-[1280px] mx-auto px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 bg-white p-8 border border-slate-200 text-center">
                    <div className="w-24 h-24 bg-[#FC9430]/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#FC9430]">
                        <span className="material-symbols-outlined text-[#FC9430] text-6xl">check_circle</span>
                    </div>
                    <h1 className="text-4xl font-bold text-primary-container mb-2">¡Compra Confirmada!</h1>
                    <p className="text-2xl text-[#FC9430] mb-4">#ELD-10254</p>
                    <p className="text-lg text-on-surface-variant mb-8">
                        Hemos recibido tu compra correctamente. En breve recibirás un correo de confirmación.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <button className="bg-[#FC9430] text-white px-6 py-3 font-bold uppercase hover:bg-[#e0852b] transition-colors">
                            Descargar Factura
                        </button>
                        <Link to="/catalogo" className="bg-white text-primary-container border-2 border-primary-container px-6 py-3 font-bold uppercase hover:bg-slate-50">
                            Seguir Comprando
                        </Link>
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                        <div className="bg-primary-container text-white p-4">
                            <h2 className="font-bold uppercase">Resumen de Compra</h2>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>$243.500</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Envío</span>
                                <span>$4.500</span>
                            </div>
                            <div className="flex justify-between font-bold text-xl pt-4 border-t">
                                <span>TOTAL</span>
                                <span>$248.000</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}