import { useParams } from 'react-router-dom'

export default function AdminEditClient() {
    const { id } = useParams()

    return (
        <>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-primary">Editar Perfil de Cliente</h2>
                <p className="text-slate-500">Modificando registro: Minera Las Ánimas</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white border p-6">
                        <h3 className="font-bold text-primary mb-4">Información de la Empresa</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold uppercase mb-2 block">Nombre de la Empresa</label>
                                <input className="w-full border p-3" defaultValue="Minera Las Ánimas" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold uppercase mb-2 block">RUT</label>
                                    <input className="w-full border p-3" defaultValue="76.452.122-K" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold uppercase mb-2 block">Tipo de Negocio</label>
                                    <select className="w-full border p-3">
                                        <option>Minería y Extracción</option>
                                        <option>Construcción</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5">
                    <div className="bg-white border p-6">
                        <h3 className="font-bold text-primary mb-4">Configuración de Cuenta</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold uppercase mb-2 block">Nivel de Cliente</label>
                                <select className="w-full border p-3">
                                    <option>Premium (Compras +$400K)</option>
                                    <option>Estándar</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-bold uppercase mb-2 block">Estado</label>
                                <select className="w-full border p-3">
                                    <option>Activo</option>
                                    <option>Inactivo</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
                <button className="border border-primary text-primary px-6 py-3 font-bold uppercase hover:bg-slate-50">
                    Descartar Cambios
                </button>
                <button className="bg-[#FC9430] text-white px-6 py-3 font-bold uppercase hover:bg-[#e0852b]">
                    Guardar Cambios
                </button>
            </div>
        </>
    )
}