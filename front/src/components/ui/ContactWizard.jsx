// src/components/ui/ContactWizard.jsx
import { useState } from 'react'
import Icon from './Icon'
import api from '../../config/api'

const steps = {
    FORM: 'form',
    CONFIRM: 'confirm',
    SUCCESS: 'success'
}

export default function ContactWizard({ onClose }) {
    const [currentStep, setCurrentStep] = useState(steps.FORM)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [messageId, setMessageId] = useState(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
    })
    const [formErrors, setFormErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const errors = {}
        if (!formData.name.trim()) errors.name = 'Nombre completo es requerido'
        if (!formData.email.trim()) errors.email = 'Email es requerido'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email inválido'
        if (!formData.subject.trim()) errors.subject = 'Asunto es requerido'
        if (!formData.message.trim()) errors.message = 'Mensaje es requerido'

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleNext = () => {
        if (currentStep === steps.FORM) {
            if (validateForm()) {
                setCurrentStep(steps.CONFIRM)
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }
        } else if (currentStep === steps.CONFIRM) {
            handleSubmit()
        }
    }

    const handleBack = () => {
        if (currentStep === steps.CONFIRM) {
            setCurrentStep(steps.FORM)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.message || 'Error al enviar el mensaje')

            setMessageId(data.id)
            setCurrentStep(steps.SUCCESS)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } catch (err) {
            console.error('Error sending message:', err)
            setError(err.message || 'Error al enviar el mensaje')
        } finally {
            setLoading(false)
        }
    }

    const handleEdit = () => {
        setCurrentStep(steps.FORM)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        alert('✅ ID copiado al portapapeles')
    }

    return (
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                    <Icon name="mail" />
                    {currentStep === steps.FORM && 'Nuevo Mensaje'}
                    {currentStep === steps.CONFIRM && 'Confirmar Mensaje'}
                    {currentStep === steps.SUCCESS && '¡Mensaje Enviado!'}
                </h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <Icon name="close" className="text-2xl" />
                </button>
            </div>

            <div className="p-6">
                {/* Progress Bar */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4 w-full">
                        <div className={`flex-1 h-1 rounded-full ${currentStep === steps.FORM ? 'bg-[#FC9430]' : 'bg-[#FC9430]'}`}></div>
                        <div className={`flex-1 h-1 rounded-full ${currentStep === steps.FORM ? 'bg-gray-200' : currentStep === steps.CONFIRM ? 'bg-[#FC9430]' : 'bg-[#FC9430]'}`}></div>
                        <div className={`flex-1 h-1 rounded-full ${currentStep === steps.SUCCESS ? 'bg-[#FC9430]' : 'bg-gray-200'}`}></div>
                    </div>
                </div>

                {/* Step indicators */}
                <div className="flex justify-between mb-6 text-xs font-bold uppercase text-gray-400">
                    <span className={currentStep === steps.FORM ? 'text-[#FC9430]' : ''}>Paso 1: Escribir</span>
                    <span className={currentStep === steps.CONFIRM ? 'text-[#FC9430]' : ''}>Paso 2: Confirmar</span>
                    <span className={currentStep === steps.SUCCESS ? 'text-[#FC9430]' : ''}>Paso 3: Enviado</span>
                </div>

                {/* PASO 1: FORMULARIO */}
                {currentStep === steps.FORM && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Nombre Completo *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition`}
                                    placeholder="Juan Pérez"
                                />
                                {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Email *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition`}
                                    placeholder="juan@empresa.cl"
                                />
                                {formErrors.email && <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Teléfono</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                    placeholder="+56 9 1234 5678"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Empresa</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                    placeholder="Mi Empresa S.A."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Asunto *</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border ${formErrors.subject ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition`}
                                placeholder="¿En qué podemos ayudarte?"
                            />
                            {formErrors.subject && <p className="mt-1 text-xs text-red-500">{formErrors.subject}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Mensaje *</label>
                            <textarea
                                name="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border ${formErrors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition resize-none`}
                                placeholder="Cuéntanos detalladamente tu consulta..."
                            />
                            {formErrors.message && <p className="mt-1 text-xs text-red-500">{formErrors.message}</p>}
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-full bg-[#FC9430] text-white py-4 font-bold uppercase rounded-lg hover:bg-[#e0852b] transition-all flex items-center justify-center gap-2"
                        >
                            <Icon name="arrow_forward" className="text-sm" />
                            Revisar Mensaje
                        </button>
                    </div>
                )}

                {/* PASO 2: CONFIRMACIÓN */}
                {currentStep === steps.CONFIRM && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                            <div className="flex items-center gap-2">
                                <Icon name="info" className="text-blue-500" />
                                <p className="text-sm text-blue-700 font-medium">Revisa los datos antes de enviar</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-5 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Nombre</p>
                                    <p className="font-medium">{formData.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">Email</p>
                                    <p className="font-medium">{formData.email}</p>
                                </div>
                                {formData.phone && (
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold">Teléfono</p>
                                        <p className="font-medium">{formData.phone}</p>
                                    </div>
                                )}
                                {formData.company && (
                                    <div>
                                        <p className="text-xs text-gray-400 uppercase font-bold">Empresa</p>
                                        <p className="font-medium">{formData.company}</p>
                                    </div>
                                )}
                            </div>

                            <div className="border-t pt-3">
                                <p className="text-xs text-gray-400 uppercase font-bold">Asunto</p>
                                <p className="font-medium">{formData.subject}</p>
                            </div>

                            <div className="border-t pt-3">
                                <p className="text-xs text-gray-400 uppercase font-bold">Mensaje</p>
                                <div className="bg-white p-3 rounded border border-gray-200 mt-1">
                                    <p className="text-sm whitespace-pre-wrap">{formData.message}</p>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                onClick={handleBack}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-bold uppercase rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <Icon name="arrow_back" className="text-sm" />
                                Editar
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={loading}
                                className="flex-1 bg-[#FC9430] text-white py-3 font-bold uppercase rounded-lg hover:bg-[#e0852b] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Icon name="send" className="text-sm" />
                                        Enviar Mensaje
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* PASO 3: ÉXITO */}
                {currentStep === steps.SUCCESS && (
                    <div className="text-center space-y-6">
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <Icon name="check_circle" className="text-5xl text-green-600" />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-primary mb-2">¡Mensaje Enviado!</h2>
                            <p className="text-gray-600">
                                Hemos recibido tu mensaje correctamente. Nuestro equipo lo revisará y te responderá pronto.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-5">
                            <p className="text-xs text-gray-400 uppercase font-bold mb-2">ID de seguimiento</p>
                            <div className="flex items-center justify-center gap-3">
                                <code className="bg-white px-4 py-2 rounded border font-mono text-sm font-bold text-primary">
                                    {messageId}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(messageId)}
                                    className="text-primary hover:text-[#FC9430] transition-colors"
                                    title="Copiar ID"
                                >
                                    <Icon name="content_copy" className="text-sm" />
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                Guarda este ID para dar seguimiento a tu mensaje
                            </p>
                        </div>

                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded text-left">
                            <div className="flex items-center gap-2">
                                <Icon name="mail" className="text-green-500" />
                                <div>
                                    <p className="text-sm text-green-700 font-medium">Confirmación enviada a tu correo</p>
                                    <p className="text-xs text-green-600">Hemos enviado un resumen a {formData.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button
                                onClick={() => {
                                    setFormData({ name: '', email: '', phone: '', company: '', subject: '', message: '' })
                                    setCurrentStep(steps.FORM)
                                    setMessageId(null)
                                }}
                                className="flex-1 bg-[#FC9430] text-white py-3 font-bold uppercase rounded-lg hover:bg-[#e0852b] transition-colors flex items-center justify-center gap-2"
                            >
                                <Icon name="send" className="text-sm" />
                                Enviar Otro Mensaje
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 border-2 border-primary text-primary py-3 font-bold uppercase rounded-lg hover:bg-primary/5 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}