export default function AdminDashboard() {
    return (
        <>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-primary">Resumen de Pedidos</h2>
                    <p className="text-on-surface-variant">Seguimiento de cotizaciones, pedidos y despachos.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-primary-container text-white p-6">
                    <p className="text-sm uppercase opacity-80 mb-2">Ventas Totales (Mes)</p>
                    <h3 className="text-4xl font-black">$1,248,590</h3>
                </div>
                <div className="bg-white p-6 border">
                    <p className="text-sm uppercase text-slate-500">Pedidos Pendientes</p>
                    <h3 className="text-2xl font-bold text-primary">28</h3>
                </div>
                <div className="bg-white p-6 border">
                    <p className="text-sm uppercase text-slate-500">Clientes Nuevos</p>
                    <h3 className="text-2xl font-bold text-primary">12</h3>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white border">
                <div className="p-4 border-b">
                    <h4 className="font-bold text-primary">Despachos Recientes</h4>
                </div>
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm">PEDIDO ID</th>
                            <th className="px-4 py-3 text-left text-sm">CLIENTE</th>
                            <th className="px-4 py-3 text-left text-sm">ESTADO</th>
                            <th className="px-4 py-3 text-left text-sm">MONTO</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-t">
                            <td className="px-4 py-3 font-bold text-primary">#ELD-9921</td>
                            <td className="px-4 py-3">Minera Las Ánimas</td>
                            <td className="px-4 py-3"><span className="bg-[#FC9430] text-white px-2 py-1 text-xs">En Bordado</span></td>
                            <td className="px-4 py-3 font-bold">$248,000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}