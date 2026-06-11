// src/pages/admin/zones/shipments/AdminShipmentsDirectory.jsx
import { useState, useEffect } from 'react'
import Icon from '../../../../components/ui/Icon'
import api from '../../../../config/api'

export default function AdminShipmentsDirectory() {
    const [shipments, setShipments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterCarrier, setFilterCarrier] = useState('all')
    const [showModal, setShowModal] = useState(false)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [editingShipment, setEditingShipment] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [formData, setFormData] = useState({
        orderId: '',
        userId: '',
        trackingNumber: '',
        carrier: 'propio',
        carrierName: '',
        status: 'Pedido Recibido',
        estimatedDelivery: '',
        notes: ''
    })

    const statusOptions = [
        { value: 'Pedido Recibido', label: 'Pedido Recibido', color: 'bg-yellow-500' },
        { value: 'En Preparación', label: 'En Preparación', color: 'bg-blue-500' },
        { value: 'En Tránsito', label: 'En Tránsito', color: 'bg-orange-500' },
        { value: 'Entregado', label: 'Entregado', color: 'bg-green-500' }
    ]

    const carrierOptions = [
        { value: 'propio', label: 'Envío Propio', color: 'bg-primary' },
        { value: 'externo', label: 'Empresa Externa', color: 'bg-[#FC9430]' }
    ]

    useEffect(() => {
        fetchShipments()
    }, [])

    const fetchShipments = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/shipments`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            })
            if (!response.ok) throw new Error('Error al cargar envíos')
            const data = await response.json()
            setShipments(data.data || [])
        } catch (err) {
            console.error('Error fetching shipments:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleCreate = () => {
        setEditingShipment(null)
        setFormData({
            orderId: '',
            userId: '',
            trackingNumber: '',
            carrier: 'propio',
            carrierName: '',
            status: 'Pedido Recibido',
            estimatedDelivery: '',
            notes: ''
        })
        setShowModal(true)
    }

    const handleEdit = (shipment) => {
        setEditingShipment(shipment)
        setFormData({
            orderId: shipment.orderId || '',
            userId: shipment.userId || '',
            trackingNumber: shipment.trackingNumber || '',
            carrier: shipment.carrier || 'propio',
            carrierName: shipment.carrierName || '',
            status: shipment.status || 'Pedido Recibido',
            estimatedDelivery: shipment.estimatedDelivery?.split('T')[0] || '',
            notes: shipment.notes || ''
        })
        setShowModal(true)
    }

    const handleUpdateStatus = (shipment) => {
        setEditingShipment(shipment)
        setFormData({
            ...formData,
            status: shipment.status
        })
        setShowStatusModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const url = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/shipments${editingShipment ? `/${editingShipment.id}` : ''}`
            const method = editingShipment ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message || 'Error al guardar envío')
            }

            await fetchShipments()
            setShowModal(false)
            alert(editingShipment ? '✅ Envío actualizado correctamente' : '✅ Envío creado correctamente')
        } catch (err) {
            console.error('Error saving shipment:', err)
            alert('❌ Error al guardar envío: ' + err.message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleStatusUpdate = async () => {
        if (!editingShipment) return

        setSubmitting(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/shipments/${editingShipment.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify({ status: formData.status }),
            })

            if (!response.ok) throw new Error('Error al actualizar estado')

            await fetchShipments()
            setShowStatusModal(false)
            alert('✅ Estado del envío actualizado correctamente')
        } catch (err) {
            console.error('Error updating status:', err)
            alert('❌ Error al actualizar estado: ' + err.message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id, trackingNumber) => {
        if (!confirm(`¿Estás seguro de eliminar el envío ${trackingNumber}?`)) return

        setDeletingId(id)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/shipments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            })

            if (!response.ok) throw new Error('Error al eliminar envío')

            await fetchShipments()
            alert('✅ Envío eliminado correctamente')
        } catch (err) {
            console.error('Error deleting shipment:', err)
            alert('❌ Error al eliminar envío: ' + err.message)
        } finally {
            setDeletingId(null)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const getStatusBadge = (status) => {
        const option = statusOptions.find(opt => opt.value === status)
        return (
            <span className={`${option?.color || 'bg-gray-500'} text-white px-2 py-1 text-xs font-bold uppercase rounded`}>
                {option?.label || status}
            </span>
        )
    }

    const getCarrierBadge = (carrier, carrierName) => {
        const option = carrierOptions.find(opt => opt.value === carrier)
        return (
            <span className={`${option?.color || 'bg-gray-500'} text-white px-2 py-1 text-xs font-bold uppercase rounded`}>
                {carrier === 'externo' ? carrierName || 'Externo' : 'Envío Propio'}
            </span>
        )
    }

    const filteredShipments = shipments.filter(shipment => {
        const matchesSearch = shipment.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shipment.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = filterStatus === 'all' || shipment.status === filterStatus
        const matchesCarrier = filterCarrier === 'all' || shipment.carrier === filterCarrier
        return matchesSearch && matchesStatus && matchesCarrier
    })

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                            <Icon name="local_shipping" className="text-4xl" />
                            Directorio de Envíos
                        </h2>
                        <p className="text-on-surface-variant mt-1">Gestión completa de despachos y seguimiento</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="bg-[#FC9430] text-white px-4 py-2 rounded-lg font-bold uppercase text-sm hover:bg-[#e0852b] transition-colors flex items-center gap-2"
                    >
                        <Icon name="add" className="text-sm" />
                        Nuevo Envío
                    </button>
                </div>

                {/* Resumen rápido por estado */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {statusOptions.map(opt => (
                        <div
                            key={opt.value}
                            className={`${opt.color} bg-opacity-10 rounded-lg p-4 cursor-pointer hover:bg-opacity-20 transition-all`}
                            onClick={() => setFilterStatus(opt.value)}
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-700">{opt.label}</span>
                                <span className={`${opt.color} text-white text-sm font-bold px-2 py-0.5 rounded-full`}>
                                    {shipments.filter(s => s.status === opt.value).length}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <Icon name="search" className="text-gray-400 text-sm" />
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar por número de seguimiento o ID de orden..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                    >
                        <option value="all">Todos los estados</option>
                        {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <select
                        value={filterCarrier}
                        onChange={(e) => setFilterCarrier(e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                    >
                        <option value="all">Todos los transportistas</option>
                        <option value="propio">Envío Propio</option>
                        <option value="externo">Empresa Externa</option>
                    </select>
                    <button
                        onClick={() => {
                            setSearchTerm('')
                            setFilterStatus('all')
                            setFilterCarrier('all')
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Limpiar filtros
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Tabla de envíos */}
                <div className="bg-white rounded-xl border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">N° Seguimiento</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Orden</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Cliente</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Transportista</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Estado</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Fecha Estimada</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredShipments.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-8 text-gray-500">
                                            No se encontraron envíos
                                        </td>
                                    </tr>
                                ) : (
                                    filteredShipments.map(shipment => (
                                        <tr key={shipment.id} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="font-mono text-sm font-bold text-primary">
                                                    {shipment.trackingNumber}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-mono text-sm">
                                                    {shipment.orderId?.slice(-8).toUpperCase() || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm">{shipment.user?.name || shipment.userId?.slice(-8) || 'N/A'}</div>
                                                <div className="text-xs text-gray-500">{shipment.user?.email || ''}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {getCarrierBadge(shipment.carrier, shipment.carrierName)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getStatusBadge(shipment.status)}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toLocaleDateString('es-CL') : '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(shipment)}
                                                        className="text-primary hover:text-[#FC9430] transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Icon name="edit" className="text-sm" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(shipment)}
                                                        className="text-[#FC9430] hover:text-primary transition-colors"
                                                        title="Cambiar estado"
                                                    >
                                                        <Icon name="sync" className="text-sm" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(shipment.id, shipment.trackingNumber)}
                                                        disabled={deletingId === shipment.id}
                                                        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                                                        title="Eliminar"
                                                    >
                                                        {deletingId === shipment.id ? (
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

                {/* Resumen */}
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600">
                        Total de envíos: <strong>{shipments.length}</strong> · Mostrando: <strong>{filteredShipments.length}</strong>
                    </p>
                </div>
            </div>

            {/* Modal de Creación/Edición */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-primary">
                                {editingShipment ? 'Editar Envío' : 'Crear Nuevo Envío'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <Icon name="close" className="text-2xl" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">ID de Orden *</label>
                                    <input
                                        type="text"
                                        name="orderId"
                                        value={formData.orderId}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="uuid-de-la-orden"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">ID de Usuario *</label>
                                    <input
                                        type="text"
                                        name="userId"
                                        value={formData.userId}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="uuid-del-usuario"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Número de Seguimiento *</label>
                                    <input
                                        type="text"
                                        name="trackingNumber"
                                        value={formData.trackingNumber}
                                        onChange={handleChange}
                                        required
                                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                        placeholder="ELD-2025-001"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Transportista *</label>
                                    <select
                                        name="carrier"
                                        value={formData.carrier}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        <option value="propio">Envío Propio</option>
                                        <option value="externo">Empresa Externa</option>
                                    </select>
                                </div>
                                {formData.carrier === 'externo' && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Nombre de la Empresa</label>
                                        <input
                                            type="text"
                                            name="carrierName"
                                            value={formData.carrierName}
                                            onChange={handleChange}
                                            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="Ej: Chilexpress, Starken"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Estado</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                    >
                                        {statusOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Fecha Estimada de Entrega</label>
                                    <input
                                        type="date"
                                        name="estimatedDelivery"
                                        value={formData.estimatedDelivery}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Notas / Observaciones</label>
                                <textarea
                                    name="notes"
                                    rows="3"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none resize-none"
                                    placeholder="Instrucciones adicionales para el despacho..."
                                />
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
                                    {submitting ? 'Guardando...' : (editingShipment ? 'Actualizar' : 'Crear')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de Cambio de Estado */}
            {showStatusModal && editingShipment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-primary">Cambiar Estado de Envío</h3>
                            <button onClick={() => setShowStatusModal(false)} className="text-gray-400 hover:text-gray-600">
                                <Icon name="close" className="text-2xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">N° Seguimiento</p>
                                <p className="font-mono font-bold text-primary">{editingShipment.trackingNumber}</p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nuevo Estado</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                                >
                                    {statusOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg mb-4">
                                <p className="text-xs text-blue-700">
                                    <strong>Nota:</strong> Al cambiar el estado del envío, se actualizará automáticamente el estado de la orden relacionada.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="flex-1 px-4 py-2 border rounded-lg font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={submitting || formData.status === editingShipment.status}
                                    className="flex-1 bg-[#FC9430] text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Actualizando...
                                        </>
                                    ) : (
                                        'Actualizar Estado'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}