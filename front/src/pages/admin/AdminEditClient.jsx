import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../config/api'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../../components/ui/Icon'

export default function AdminEditClient() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { isAdmin } = useAuth()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        rut: '',
        role: 'client',
        isActive: true
    })

    useEffect(() => {
        const fetchClient = async () => {
            if (!isAdmin) return

            try {
                setLoading(true)
                const user = await api.admin.getUserById(id)
                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    company: user.company || '',
                    rut: user.rut || '',
                    role: user.role || 'client',
                    isActive: user.isActive !== undefined ? user.isActive : true
                })
            } catch (err) {
                console.error('Error fetching client:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchClient()
    }, [id, isAdmin])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError(null)
        setSuccess(false)

        try {
            // ✅ Enviar solo los campos que queremos actualizar
            const updateData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone || null,
                company: formData.company || null,
                rut: formData.rut || null,
                role: formData.role,
                isActive: formData.isActive
            }

            console.log('📤 Enviando datos de actualización:', updateData)

            await api.admin.updateUser(id, updateData)
            setSuccess(true)
            setTimeout(() => {
                navigate('/admin/clientes')
            }, 2000)
        } catch (err) {
            console.error('Error updating client:', err)
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error && !loading) {
        return (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">Error al cargar el cliente: {error}</p>
                <button
                    onClick={() => navigate('/admin/clientes')}
                    className="mt-4 bg-primary text-white px-4 py-2 rounded"
                >
                    Volver a clientes
                </button>
            </div>
        )
    }

    return (
        <>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-primary">Editar Perfil de Cliente</h2>
                <p className="text-slate-500">Modificando registro: {formData.name}</p>
            </div>

            {success && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded animate-fade-in-up">
                    <div className="flex items-center gap-2">
                        <Icon name="check_circle" className="text-green-500" />
                        <p className="text-green-700">Cliente actualizado correctamente. Redirigiendo...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white border p-6">
                            <h3 className="font-bold text-primary mb-4">Información de la Empresa</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold uppercase mb-2 block">Nombre Completo *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-outline-variant p-3 focus:ring-2 focus:ring-primary outline-none rounded"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold uppercase mb-2 block">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-outline-variant p-3 focus:ring-2 focus:ring-primary outline-none rounded"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold uppercase mb-2 block">Teléfono</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full border border-outline-variant p-3 focus:ring-2 focus:ring-primary outline-none rounded"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold uppercase mb-2 block">Empresa</label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            className="w-full border border-outline-variant p-3 focus:ring-2 focus:ring-primary outline-none rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold uppercase mb-2 block">RUT</label>
                                        <input
                                            type="text"
                                            name="rut"
                                            value={formData.rut}
                                            onChange={handleChange}
                                            className="w-full border border-outline-variant p-3 focus:ring-2 focus:ring-primary outline-none rounded"
                                        />
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
                                    <label className="text-sm font-bold uppercase mb-2 block">Rol</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full border border-outline-variant p-3 focus:ring-2 focus:ring-primary outline-none rounded"
                                    >
                                        <option value="client">Cliente</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        className="w-5 h-5 text-primary focus:ring-primary border-outline-variant rounded"
                                    />
                                    <label className="text-sm font-bold uppercase">Cuenta Activa</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/clientes')}
                        className="border border-primary text-primary px-6 py-3 font-bold uppercase hover:bg-slate-50 rounded transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-[#FC9430] text-white px-6 py-3 font-bold uppercase hover:bg-[#e0852b] transition-all rounded disabled:opacity-50"
                    >
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </>
    )
}