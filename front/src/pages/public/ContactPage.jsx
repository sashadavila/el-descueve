import { Link } from 'react-router-dom'
import Icon from '../../components/ui/Icon'

export default function ContactPage() {
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
                        {/* Tarjeta de Dirección */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Icon name="location_on" className="text-2xl text-primary" />
                                </div>
                                <h3 className="text-lg font-bold text-primary uppercase">Dirección</h3>
                            </div>
                            <div className="space-y-2 text-gray-600">
                                <p>{contactInfo.address.street}</p>
                                <p>{contactInfo.address.city}, {contactInfo.address.region}</p>
                                <p>{contactInfo.address.country} - {contactInfo.address.zipCode}</p>
                                <button
                                    onClick={() => handleCopyText(`${contactInfo.address.street}, ${contactInfo.address.city}`, 'Dirección')}
                                    className="text-xs text-[#FC9430] hover:underline mt-2 flex items-center gap-1"
                                >
                                    <Icon name="content_copy" className="text-sm" />
                                    Copiar dirección
                                </button>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <a
                                    href="https://maps.google.com/?q=La+Serena+Chile"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:text-[#FC9430] transition-colors flex items-center gap-1"
                                >
                                    <Icon name="map" className="text-sm" />
                                    Ver en Google Maps
                                </a>
                            </div>
                        </div>

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

                    {/* Formulario de contacto y mapa */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Mapa */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                            <div className="h-64 md:h-80 w-full bg-gray-200 relative">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11181.628279311753!2d-71.256287!3d-29.908538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x968ea0c8b9c6c8f7%3A0x8b3b7e4e5c3b2a1!2sLa%20Serena%2C%20Chile!5e0!3m2!1ses!2scl!4v1699999999999!5m2!1ses!2scl"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Ubicación de El Descuevee"
                                ></iframe>
                            </div>
                        </div>

                        {/* Formulario de contacto */}
                        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Icon name="mail" className="text-2xl text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-primary uppercase">Envíanos un Mensaje</h3>
                            </div>

                            <form className="space-y-5" onSubmit={(e) => {
                                e.preventDefault()
                                alert('Mensaje enviado. Te contactaremos pronto.')
                                e.target.reset()
                            }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Nombre Completo *</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                            placeholder="Juan Pérez"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Email *</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                            placeholder="juan@empresa.cl"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Teléfono</label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                            placeholder="+56 9 1234 5678"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Empresa</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                            placeholder="Nombre de tu empresa"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Asunto *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                                        placeholder="¿En qué podemos ayudarte?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Mensaje *</label>
                                    <textarea
                                        rows="5"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition resize-none"
                                        placeholder="Cuéntanos detalladamente tu consulta..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#FC9430] text-white py-3 px-6 font-bold uppercase tracking-wider rounded-lg hover:bg-[#e0852b] transition-all transform hover:scale-[1.02]"
                                >
                                    Enviar Mensaje
                                </button>
                            </form>
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

            <style jsx>{`
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