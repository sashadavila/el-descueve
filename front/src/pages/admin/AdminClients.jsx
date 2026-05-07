export default function AdminClients() {
    const clients = [
        { id: 'ELD-9021', name: 'Minera Las Ánimas', rut: '76.452.122-K', region: 'Antofagasta', orders: 28, total: 428000, status: 'Premium' },
        { id: 'ELD-8854', name: 'Constructora Titán', rut: '71.833.409-2', region: 'Santiago', orders: 15, total: 156000, status: 'Estándar' }
    ]

    return (
        <>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-primary">Directorio de Clientes</h2>
                    <p className="text-on-surface-variant">Gestión de clientes corporativos</p>
                </div>
                <button className="bg-[#FC9430] text-white px-6 py-3 font-bold uppercase hover:bg-[#e0852b]">
                    Nuevo Cliente
                </button>
            </div>

            <div className="bg-white border overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm">ID</th>
                            <th className="px-4 py-3 text-left text-sm">Nombre / Empresa</th>
                            <th className="px-4 py-3 text-left text-sm">Ubicación</th>
                            <th className="px-4 py-3 text-left text-sm">Pedidos</th>
                            <th className="px-4 py-3 text-left text-sm">Valor Total</th>
                            <th className="px-4 py-3 text-left text-sm">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map(client => (
                            <tr key={client.id} className="border-t hover:bg-slate-50">
                                <td className="px-4 py-3 text-xs font-mono">{client.id}</td>
                                <td className="px-4 py-3">
                                    <div className="font-bold text-primary">{client.name}</div>
                                    <div className="text-xs text-slate-500">RUT: {client.rut}</div>
                                </td>
                                <td className="px-4 py-3">{client.region}</td>
                                <td className="px-4 py-3 font-bold">{client.orders}</td>
                                <td className="px-4 py-3 font-bold text-primary">${client.total.toLocaleString()}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 text-xs font-bold uppercase ${client.status === 'Premium' ? 'bg-primary text-white' : 'bg-slate-200'}`}>
                                        {client.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}