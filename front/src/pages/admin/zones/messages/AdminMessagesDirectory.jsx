// src/pages/admin/zones/messages/AdminMessagesDirectory.jsx
import { useState, useEffect } from 'react'
import Icon from '../../../../components/ui/Icon'
import api from '../../../../config/api'

const statusOptions = [
    { value: 'pending', label: 'Pendiente', color: 'bg-yellow-500' },
    { value: 'read', label: 'Leído', color: 'bg-blue-500' },
    { value: 'responded', label: 'Respondido', color: 'bg-green-500' },
    { value: 'archived', label: 'Archivado', color: 'bg-gray-500' },
]

export default function AdminMessagesDirectory() {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalMessages, setTotalMessages] = useState(0)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [showResponseModal, setShowResponseModal] = useState(false)
    const [newStatus, setNewStatus] = useState('')
    const [adminNotes, setAdminNotes] = useState('')
    const [responseText, setResponseText] = useState('')
    const [updating, setUpdating] = useState(false)
    const [sendingResponse, setSendingResponse] = useState(false)
    const [deletingId, setDeletingId] = useState(null)

    const itemsPerPage = 15

    const loadMessages = async () => {
        setLoading(true)
        try {
            const response = await api.contact.getAll(
                filterStatus !== 'all' ? filterStatus : null,
                currentPage,
                itemsPerPage
            )
            setMessages(response.data || [])
            setTotalPages(response.totalPages || 1)
            setTotalMessages(response.total || 0)
        } catch (err) {
            console.error('Error loading messages:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadMessages()
    }, [currentPage, filterStatus])

    const filteredMessages = messages.filter(message =>
        message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.id?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusBadge = (status) => {
        const option = statusOptions.find(opt => opt.value === status)
        return (
            <span className={`${option?.color || 'bg-gray-500'} text-white px-2 py-1 text-xs font-bold uppercase rounded`}>
                {option?.label || status}
            </span>
        )
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-CL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const openDetailModal = (message) => {
        setSelectedMessage(message)
        setShowDetailModal(true)
    }

    const openStatusModal = (message) => {
        setSelectedMessage(message)
        setNewStatus(message.status)
        setAdminNotes(message.adminNotes || '')
        setShowStatusModal(true)
    }

    // ✅ NUEVO: Abrir modal de respuesta
    const openResponseModal = (message) => {
        setSelectedMessage(message)
        setResponseText('')
        setShowResponseModal(true)
    }

    // ✅ NUEVO: Enviar respuesta
    const handleSendResponse = async () => {
        if (!selectedMessage) return
        if (!responseText.trim()) {
            alert('Por favor, escribe una respuesta antes de enviar')
            return
        }

        setSendingResponse(true)
        try {
            await api.contact.respond(selectedMessage.id, responseText)
            await loadMessages()
            setShowResponseModal(false)
            setSelectedMessage(null)
            setResponseText('')
            alert('✅ Respuesta enviada correctamente. El cliente recibirá un email con tu respuesta.')
        } catch (err) {
            console.error('Error sending response:', err)
            alert('❌ Error al enviar la respuesta: ' + err.message)
        } finally {
            setSendingResponse(false)
        }
    }

    const handleUpdateStatus = async () => {
        if (!selectedMessage) return

        setUpdating(true)
        try {
            await api.contact.updateStatus(selectedMessage.id, newStatus, adminNotes)
            await loadMessages()
            setShowStatusModal(false)
            setSelectedMessage(null)
            alert('✅ Estado del mensaje actualizado correctamente')
        } catch (err) {
            console.error('Error updating status:', err)
            alert('❌ Error al actualizar el estado: ' + err.message)
        } finally {
            setUpdating(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este mensaje?')) return

        setDeletingId(id)
        try {
            await api.contact.delete(id)
            await loadMessages()
            alert('✅ Mensaje eliminado correctamente')
        } catch (err) {
            console.error('Error deleting message:', err)
            alert('❌ Error al eliminar mensaje: ' + err.message)
        } finally {
            setDeletingId(null)
        }
    }

    const Pagination = () => {
        if (totalPages <= 1) return null

        const pages = []
        const maxVisible = 5
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
        let endPage = Math.min(totalPages, startPage + maxVisible - 1)

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }

        return (
            <div className="flex justify-center items-center gap-2 mt-6">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Anterior
                </button>
                {startPage > 1 && (
                    <>
                        <button onClick={() => setCurrentPage(1)} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">1</button>
                        {startPage > 2 && <span className="px-2">...</span>}
                    </>
                )}
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 text-sm border rounded-lg ${currentPage === page ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                    >
                        {page}
                    </button>
                ))}
                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="px-2">...</span>}
                        <button onClick={() => setCurrentPage(totalPages)} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">{totalPages}</button>
                    </>
                )}
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Siguiente
                </button>
            </div>
        )
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
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                        <Icon name="mail" className="text-4xl" />
                        Directorio de Mensajes
                    </h2>
                    <p className="text-on-surface-variant mt-1">Gestión completa de mensajes de contacto</p>
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
                                    {messages.filter(m => m.status === opt.value).length}
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
                            placeholder="Buscar por nombre, email, asunto o ID..."
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
                    <button
                        onClick={() => {
                            setSearchTerm('')
                            setFilterStatus('all')
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

                {/* Tabla de mensajes */}
                <div className="bg-white rounded-xl border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Remitente</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Asunto</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Fecha</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Estado</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMessages.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8 text-gray-500">
                                            No se encontraron mensajes
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMessages.map(message => (
                                        <tr key={message.id} className="border-t hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="font-mono text-sm font-bold text-primary">
                                                    {message.id.slice(-8).toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-800">{message.name}</div>
                                                <div className="text-xs text-gray-500">{message.email}</div>
                                                {message.phone && (
                                                    <div className="text-xs text-gray-400">{message.phone}</div>
                                                )}
                                                {message.company && (
                                                    <div className="text-xs text-gray-400">{message.company}</div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium">{message.subject}</div>
                                                <div className="text-xs text-gray-400 line-clamp-1 max-w-[200px]">
                                                    {message.message}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {formatDate(message.createdAt)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getStatusBadge(message.status)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openDetailModal(message)}
                                                        className="text-primary hover:text-[#FC9430] transition-colors"
                                                        title="Ver detalles"
                                                    >
                                                        <Icon name="visibility" className="text-sm" />
                                                    </button>
                                                    {/* ✅ Botón de Responder - Solo visible si no está respondido */}
                                                    {message.status !== 'responded' && (
                                                        <button
                                                            onClick={() => openResponseModal(message)}
                                                            className="text-green-600 hover:text-green-800 transition-colors"
                                                            title="Responder mensaje"
                                                        >
                                                            <Icon name="reply" className="text-sm" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => openStatusModal(message)}
                                                        className="text-[#FC9430] hover:text-primary transition-colors"
                                                        title="Cambiar estado"
                                                    >
                                                        <Icon name="edit" className="text-sm" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(message.id)}
                                                        disabled={deletingId === message.id}
                                                        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                                                        title="Eliminar"
                                                    >
                                                        {deletingId === message.id ? (
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

                {/* Paginación */}
                <Pagination />

                <div className="text-sm text-gray-500">
                    Total de mensajes: {totalMessages}
                </div>
            </div>

            {/* Modal de Detalle */}
            {showDetailModal && selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-primary">Detalle del Mensaje</h3>
                            <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                                <Icon name="close" className="text-2xl" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">ID</p>
                                    <p className="font-mono font-bold text-primary">{selectedMessage.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Fecha</p>
                                    <p className="font-medium">{formatDate(selectedMessage.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Estado</p>
                                    {getStatusBadge(selectedMessage.status)}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Remitente</p>
                                    <p className="font-medium">{selectedMessage.name}</p>
                                </div>
                            </div>

                            <div className="pb-4 border-b">
                                <p className="text-xs text-gray-400 uppercase font-bold">Contacto</p>
                                <p className="font-medium">{selectedMessage.email}</p>
                                {selectedMessage.phone && (
                                    <p className="text-sm text-gray-600">{selectedMessage.phone}</p>
                                )}
                                {selectedMessage.company && (
                                    <p className="text-sm text-gray-600">Empresa: {selectedMessage.company}</p>
                                )}
                            </div>

                            <div className="pb-4 border-b">
                                <p className="text-xs text-gray-400 uppercase font-bold">Asunto</p>
                                <p className="font-medium text-lg">{selectedMessage.subject}</p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 uppercase font-bold">Mensaje</p>
                                <div className="bg-gray-50 p-4 rounded-lg mt-2">
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>
                            </div>

                            {/* ✅ Mostrar respuesta si existe */}
                            {selectedMessage.adminResponse && (
                                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                                    <p className="text-xs text-gray-400 uppercase font-bold">Respuesta del Administrador</p>
                                    <p className="text-sm text-green-700 mt-1 whitespace-pre-wrap">{selectedMessage.adminResponse}</p>
                                    {selectedMessage.respondedAt && (
                                        <p className="text-xs text-gray-400 mt-2">Respondido el: {formatDate(selectedMessage.respondedAt)}</p>
                                    )}
                                </div>
                            )}

                            {selectedMessage.adminNotes && (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-400 uppercase font-bold">Notas del Administrador</p>
                                    <p className="text-sm text-blue-700 mt-1">{selectedMessage.adminNotes}</p>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4 border-t">
                                {selectedMessage.status !== 'responded' && (
                                    <button
                                        onClick={() => {
                                            setShowDetailModal(false)
                                            openResponseModal(selectedMessage)
                                        }}
                                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Icon name="reply" className="text-sm" />
                                        Responder
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setShowDetailModal(false)
                                        openStatusModal(selectedMessage)
                                    }}
                                    className="flex-1 bg-[#FC9430] text-white py-2 rounded-lg font-bold hover:bg-[#e0852b] transition-colors"
                                >
                                    Cambiar Estado
                                </button>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="flex-1 border border-gray-300 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Cambio de Estado */}
            {showStatusModal && selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-primary">Cambiar Estado del Mensaje</h3>
                            <button onClick={() => setShowStatusModal(false)} className="text-gray-400 hover:text-gray-600">
                                <Icon name="close" className="text-2xl" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">ID</p>
                                <p className="font-mono font-bold text-primary">{selectedMessage.id.slice(-8).toUpperCase()}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Remitente</p>
                                <p className="font-medium">{selectedMessage.name}</p>
                                <p className="text-xs text-gray-400">{selectedMessage.email}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500">Asunto</p>
                                <p className="font-medium">{selectedMessage.subject}</p>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nuevo Estado</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                                >
                                    {statusOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Notas (opcional)</label>
                                <textarea
                                    rows="3"
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none resize-none"
                                    placeholder="Agregar notas internas sobre este mensaje..."
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="flex-1 px-4 py-2 border rounded-lg font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpdateStatus}
                                    disabled={updating}
                                    className="flex-1 bg-[#FC9430] text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {updating ? (
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

            {/* ✅ NUEVO: Modal de Respuesta */}
            {showResponseModal && selectedMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                                <Icon name="reply" className="text-green-600" />
                                Responder Mensaje
                            </h3>
                            <button onClick={() => setShowResponseModal(false)} className="text-gray-400 hover:text-gray-600">
                                <Icon name="close" className="text-2xl" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Información del mensaje original */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-xs text-gray-400 uppercase font-bold">Mensaje original</p>
                                <p className="text-sm font-medium mt-1">
                                    <span className="text-gray-500">De:</span> {selectedMessage.name} ({selectedMessage.email})
                                </p>
                                <p className="text-sm">
                                    <span className="text-gray-500">Asunto:</span> {selectedMessage.subject}
                                </p>
                                <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                                    <p className="text-sm whitespace-pre-wrap text-gray-600">{selectedMessage.message}</p>
                                </div>
                                {selectedMessage.phone && (
                                    <p className="text-sm text-gray-500 mt-2">📞 {selectedMessage.phone}</p>
                                )}
                                {selectedMessage.company && (
                                    <p className="text-sm text-gray-500">🏢 {selectedMessage.company}</p>
                                )}
                            </div>

                            {/* Campo de respuesta */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">
                                    Tu respuesta *
                                </label>
                                <div className="bg-green-50 p-3 rounded-lg mb-2">
                                    <p className="text-xs text-green-700">
                                        <Icon name="info" className="text-xs inline" />
                                        Esta respuesta será enviada por email al cliente
                                    </p>
                                </div>
                                <textarea
                                    rows="6"
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition resize-none"
                                    placeholder="Escribe tu respuesta aquí... El cliente recibirá este mensaje por email."
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    <span className="text-green-600 font-bold">Consejo:</span> Sé claro y profesional. El cliente recibirá este mensaje como respuesta oficial.
                                </p>
                            </div>

                            {/* Previsualización del email */}
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <p className="text-xs text-blue-700 font-bold uppercase flex items-center gap-2">
                                    <Icon name="mail" className="text-sm" />
                                    El cliente recibirá este email
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    <strong>Para:</strong> {selectedMessage.email}
                                </p>
                                <p className="text-xs text-blue-600">
                                    <strong>Asunto:</strong> 📨 Respuesta a tu mensaje: {selectedMessage.subject}
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    onClick={() => setShowResponseModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSendResponse}
                                    disabled={sendingResponse || !responseText.trim()}
                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {sendingResponse ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Icon name="send" className="text-sm" />
                                            Enviar Respuesta
                                        </>
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