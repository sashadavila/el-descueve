// src/pages/public/ContactPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import ContactWizard from '../../components/ui/ContactWizard'

export default function ContactPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Información de contacto
    const contactInfo = {
        address: {
            street: 'Av. Los Pioneros 1234',
            city: 'La Serena',
            region: 'Región de Coquimbo',
            country: 'Chile',
            zipCode: '1700000'
        },
        phone: {
            principal: '+56 51 234 5678',
            whatsapp: '+56 9 8765 4321',
            emergency: '+56 9 1234 5678'
        },
        email: {
            sales: 'ventas@eldescuevee.cl',
            support: 'soporte@eldescuevee.cl',
            general: 'contacto@eldescuevee.cl'
        },
        schedule: {
            weekdays: 'Lunes a Viernes: 09:00 - 18:00',
            saturday: 'Sábados: 10:00 - 14:00',
            sunday: 'Domingos: Cerrado'
        },
        social: {
            instagram: 'https://instagram.com/eldescuevee',
            facebook: 'https://facebook.com/eldescuevee',
            linkedin: 'https://linkedin.com/company/eldescuevee',
            twitter: 'https://twitter.com/eldescuevee',
            youtube: 'https://youtube.com/@eldescuevee'
        }
    }

    const handleWhatsAppClick = () => {
        window.open(`https://wa.me/${contactInfo.phone.whatsapp.replace(/[^0-9]/g, '')}?text=Hola,%20quisiera%20más%20información%20sobre%20sus%20productos`, '_blank')
    }

    const handleCopyText = (text, label) => {
        navigator.clipboard.writeText(text)
        alert(`${label} copiado al portapapeles`)
    }

    const handleOpenModal = () => setIsModalOpen(true)
    const handleCloseModal = () => setIsModalOpen(false)

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
            {/* Hero Section */}
            <section className="relative bg-primary py-16 md:py-24 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=400&fit=crop')] bg-cover bg-center"></div>
                </div>
                <div className="relative z-10 max-w-[1280px] mx-auto px-8 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 uppercase">Contáctanos</h1>
                    <p className="text-lg text-white/90 max-w-2xl mx-auto">
                        Estamos aquí para ayudarte. Comunícate con nosotros y te atenderemos a la brevedad.
                    </p>
                </div>
            </section>

            <div className="max-w-[1280px] mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Información de contacto - Sidebar */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* Tarjeta de Teléfono */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Icon name="phone" className="text-2xl text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-primary uppercase">Teléfono</h3>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Oficina</p>
                                    <div className="flex items-center justify-between">
                                        <a href={`tel:${contactInfo.phone.principal}`} className="text-gray-700 hover:text-primary">
                                            {contactInfo.phone.principal}
                                        </a>
                                        <button onClick={() => handleCopyText(contactInfo.phone.principal, 'Teléfono')}>
                                            <Icon name="content_copy" className="text-sm text-gray-400 hover:text-primary" />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">WhatsApp</p>
                                    <div className="flex items-center justify-between">
                                        <a href={`https://wa.me/${contactInfo.phone.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="text-gray-700 hover:text-[#25D366]">
                                            {contactInfo.phone.whatsapp}
                                        </a>
                                        <button onClick={handleWhatsAppClick} className="text-[#25D366] hover:opacity-80">
                                            <Icon name="chat" className="text-sm" />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Emergencia</p>
                                    <div className="flex items-center justify-between">
                                        <a href={`tel:${contactInfo.phone.emergency}`} className="text-gray-700 hover:text-primary">
                                            {contactInfo.phone.emergency}
                                        </a>
                                        <button onClick={() => handleCopyText(contactInfo.phone.emergency, 'Teléfono de emergencia')}>
                                            <Icon name="content_copy" className="text-sm text-gray-400 hover:text-primary" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tarjeta de Horario */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Icon name="schedule" className="text-2xl text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-primary uppercase">Horario de Atención</h3>
                            </div>
                            <div className="space-y-2 text-gray-600">
                                <p className="flex justify-between">
                                    <span>Lunes a Viernes:</span>
                                    <span className="font-semibold">09:00 - 18:00</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Sábados:</span>
                                    <span className="font-semibold">10:00 - 14:00</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Domingos:</span>
                                    <span className="font-semibold text-gray-400">Cerrado</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Formulario de contacto */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Formulario de contacto - AHORA CON MODAL */}
                        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Icon name="mail" className="text-2xl text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-primary uppercase">Envíanos un Mensaje</h3>
                            </div>

                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Icon name="send" className="text-3xl text-primary" />
                                </div>
                                <h4 className="text-lg font-bold text-primary mb-2">¿Listo para contactarnos?</h4>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Haz clic en el botón para completar nuestro formulario de contacto.
                                    Recibirás un ID de seguimiento para darle seguimiento a tu mensaje.
                                </p>
                                <button
                                    onClick={handleOpenModal}
                                    className="inline-flex items-center gap-2 bg-[#FC9430] text-white px-8 py-4 font-bold uppercase rounded-lg hover:bg-[#e0852b] transition-all transform hover:scale-105"
                                >
                                    <Icon name="edit_note" />
                                    Escribir Mensaje
                                </button>
                            </div>
                        </div>

                        {/* Redes Sociales */}
                        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg p-6 md:p-8 text-white">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <Icon name="share" className="text-2xl" />
                                </div>
                                <h3 className="text-xl font-bold uppercase">Síguenos en Redes Sociales</h3>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                <a
                                    href={contactInfo.social.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-all transform hover:scale-105"
                                >
                                    <Icon name="photo_camera" className="text-3xl mx-auto mb-2" />
                                    <p className="text-xs font-bold uppercase">Instagram</p>
                                </a>

                                <a
                                    href={contactInfo.social.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-all transform hover:scale-105"
                                >
                                    <Icon name="facebook" className="text-3xl mx-auto mb-2" />
                                    <p className="text-xs font-bold uppercase">Facebook</p>
                                </a>

                                <a
                                    href={contactInfo.social.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-all transform hover:scale-105"
                                >
                                    <Icon name="work" className="text-3xl mx-auto mb-2" />
                                    <p className="text-xs font-bold uppercase">LinkedIn</p>
                                </a>

                                <a
                                    href={contactInfo.social.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-all transform hover:scale-105"
                                >
                                    <Icon name="alternate_email" className="text-3xl mx-auto mb-2" />
                                    <p className="text-xs font-bold uppercase">Twitter/X</p>
                                </a>

                                <a
                                    href={contactInfo.social.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-all transform hover:scale-105"
                                >
                                    <Icon name="smart_display" className="text-3xl mx-auto mb-2" />
                                    <p className="text-xs font-bold uppercase">YouTube</p>
                                </a>
                            </div>
                        </div>

                        {/* WhatsApp Flotante */}
                        <div className="fixed bottom-6 right-6 z-50">
                            <button
                                onClick={handleWhatsAppClick}
                                className="bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20b859] transition-all transform hover:scale-110 animate-bounce-slow"
                            >
                                <Icon name="chat" className="text-3xl" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sección de información adicional */}
                <div className="mt-12 p-8 bg-primary/5 rounded-xl border border-primary/10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <Icon name="local_shipping" className="text-primary text-3xl mx-auto mb-2" />
                            <h4 className="font-bold text-primary uppercase text-sm">Atención Personalizada</h4>
                            <p className="text-xs text-gray-600 mt-1">Respuesta en menos de 24 horas</p>
                        </div>
                        <div>
                            <Icon name="verified" className="text-primary text-3xl mx-auto mb-2" />
                            <h4 className="font-bold text-primary uppercase text-sm">Calidad Garantizada</h4>
                            <p className="text-xs text-gray-600 mt-1">Prendas que duran en el tiempo</p>
                        </div>
                        <div>
                            <Icon name="handshake" className="text-primary text-3xl mx-auto mb-2" />
                            <h4 className="font-bold text-primary uppercase text-sm">Trato Directo</h4>
                            <p className="text-xs text-gray-600 mt-1">Sin intermediarios</p>
                        </div>
                        <div>
                            <Icon name="groups" className="text-primary text-3xl mx-auto mb-2" />
                            <h4 className="font-bold text-primary uppercase text-sm">Pedido Mínimo</h4>
                            <p className="text-xs text-gray-600 mt-1">10 unidades combinables</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal del Wizard de Contacto */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <ContactWizard onClose={handleCloseModal} />
                </div>
            )}

            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    )
}