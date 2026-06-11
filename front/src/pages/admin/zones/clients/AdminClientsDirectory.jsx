// src/pages/admin/zones/clients/AdminClientsDirectory.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../../../config/api'
import { useAuth } from '../../../../hooks/useAuth'
import Icon from '../../../../components/ui/Icon'

export default function AdminClientsDirectory() {
    const { isAdmin } = useAuth()
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [editingClient, setEditingClient] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        rut: '',
        role: 'client',
        isActive: true
    })
    const [submitting, setSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState(null)

    useEffect(() => {
        fetchClients()
    }, [isAdmin])

    const fetchClients = async () => {
        if (!isAdmin) return

        try {
            setLoading(true)
            const users = await api.admin.getAllUsers()
            const clientUsers = users.filter(user => user.role === 'client')
            setClients(clientUsers)
        } catch (err) {
            console.error('Error fetching clients:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = (client) => {
        setEditingClient(client)
        setFormData({
            name: client.name || '',
            email: client.email || '',
            phone: client.phone || '',
            company: client.company || '',
            rut: client.rut || '',
            role: client.role || 'client',
            isActive: client.isActive !== undefined ? client.isActive : true
        })
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este cliente? Esta acción eliminará todos sus registros asociados (pedidos, envíos, etc.) y no se puede deshacer.')) {
            return
        }

        setDeletingId(id)
        try {
            // Necesitamos agregar este endpoint en el backend
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Error al eliminar cliente')
            }

            await fetchClients()
            alert('✅ Cliente eliminado correctamente')
        } catch (err) {
            console.error('Error deleting client:', err)
            alert('❌ Error al eliminar cliente: ' + err.message)
        } finally {
            setDeletingId(null)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const updateData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone || null,
                company: formData.company || null,
                rut: formData.rut || null,
                role: formData.role,
                isActive: formData.isActive
            }

            await api.admin.updateUser(editingClient.id, updateData)
            await fetchClients()
            setShowModal(false)
            setEditingClient(null)
            alert('✅ Cliente actualizado correctamente')
        } catch (err) {
            console.error('Error updating client:', err)
            alert('❌ Error al actualizar cliente: ' + err.message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.rut?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusBadge = (isActive) => {
        return isActive
            ? <span className="bg-green-100 text-green-700 px-2 py-1 text-xs font-bold uppercase rounded">Activo</span>
            : <span className="bg-red-100 text-red-700 px-2 py-1 text-xs font-bold uppercase rounded">Inactivo</span>
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                        <Icon name="contact_page" className="text-4xl" />
                        Directorio de Clientes
                    </h2>
                    <p className="text-on-surface-variant mt-1">Gestión completa de clientes</p>
                </div>
                <div className="relative w-full sm:w-80">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Icon name="search" className="text-slate-400 text-sm" />
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-outline-variant focus:ring-1 focus:ring-primary outline-none rounded"
                    />
                </div>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <div className="bg-white border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Cliente</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Contacto</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Empresa / RUT</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Registro</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Estado</th>
                                <th className="px-4 py-3 text-left text-xs font-bold uppercase">Acciones</th>
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
                                            <div className="text-xs text-slate-500">ID: {client.id.slice(-8)}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm">{client.email}</div>
                                            {client.phone && <div className="text-xs text-slate-500">{client.phone}</div>}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm">{client.company || '—'}</div>
                                            <div className="text-xs text-slate-500">{client.rut || '—'}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {new Date(client.createdAt).toLocaleDateString('es-CL')}
                                        </td>
                                        <td className="px-4 py-3">{getStatusBadge(client.isActive)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(client)}
                                                    className="text-primary hover:text-[#FC9430] transition-colors"
                                                    title="Editar"
                                                >
                                                    <Icon name="edit" className="text-sm" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(client.id)}
                                                    disabled={deletingId === client.id}
                                                    className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                                                    title="Eliminar"
                                                >
                                                    {deletingId === client.id ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                                    ) : (
                                                        <Icon name="delete" className="text-sm" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 text-sm text-slate-500">
                Total de clientes: {filteredClients.length}
            </div>

            {/* Modal de Edición */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-primary">Editar Cliente</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <Icon name="close" className="text-2xl" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Nombre Completo *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Empresa</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">RUT</label>
                                    <input
                                        type="text"
                                        name="rut"
                                        value={formData.rut}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Rol</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option value="client">Cliente</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-primary rounded"
                                />
                                <label className="text-sm font-bold text-gray-700">Cuenta Activa</label>
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 border border-gray-300 rounded font-bold hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2 bg-[#FC9430] text-white rounded font-bold hover:bg-[#e0852b] disabled:opacity-50"
                                >
                                    {submitting ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}