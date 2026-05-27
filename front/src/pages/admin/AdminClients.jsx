import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../config/api'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../../components/ui/Icon'

export default function AdminClients() {
    const { isAdmin } = useAuth()
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchClients = async () => {
            if (!isAdmin) return

            try {
                setLoading(true)
                const users = await api.admin.getAllUsers()
                // Filtrar solo clientes (no admins)
                const clientUsers = users.filter(user => user.role === 'client')
                setClients(clientUsers)
            } catch (err) {
                console.error('Error fetching clients:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchClients()
    }, [isAdmin])

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.rut?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusBadge = (isActive) => {
        return isActive
            ? <span className="bg-green-100 text-green-700 px-2 py-1 text-xs font-bold uppercase">Activo</span>
            : <span className="bg-red-100 text-red-700 px-2 py-1 text-xs font-bold uppercase">Inactivo</span>
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">Error al cargar clientes: {error}</p>
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-primary">Directorio de Clientes</h2>
                    <p className="text-on-surface-variant">Gestión de clientes corporativos</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <Icon name="search" className="text-slate-400 text-sm" />
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-3 py-2 text-sm border border-outline-variant focus:ring-1 focus:ring-primary outline-none rounded"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white border overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm">NOMBRE / EMPRESA</th>
                            <th className="px-4 py-3 text-left text-sm">CONTACTO</th>
                            <th className="px-4 py-3 text-left text-sm">RUT</th>
                            <th className="px-4 py-3 text-left text-sm">REGISTRO</th>
                            <th className="px-4 py-3 text-left text-sm">ESTADO</th>
                            <th className="px-4 py-3 text-left text-sm">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-gray-500">
                                    No se encontraron clientes
                                </td>
                            </tr>
                        ) : (
                            filteredClients.map(client => (
                                <tr key={client.id} className="border-t hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <div className="font-bold text-primary">{client.name}</div>
                                        {client.company && (
                                            <div className="text-xs text-slate-500">{client.company}</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm">{client.email}</div>
                                        {client.phone && (
                                            <div className="text-xs text-slate-500">{client.phone}</div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm">{client.rut || '—'}</td>
                                    <td className="px-4 py-3 text-sm">
                                        {new Date(client.createdAt).toLocaleDateString('es-CL')}
                                    </td>
                                    <td className="px-4 py-3">{getStatusBadge(client.isActive)}</td>
                                    <td className="px-4 py-3">
                                        <Link
                                            to={`/admin/clientes/editar/${client.id}`}
                                            className="text-primary hover:text-[#FC9430] transition-colors flex items-center gap-1"
                                        >
                                            <Icon name="edit" className="text-sm" />
                                            <span className="text-xs uppercase font-bold">Editar</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-sm text-slate-500">
                Total de clientes: {filteredClients.length}
            </div>
        </>
    )
}