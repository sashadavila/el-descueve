import { useState } from 'react'
import Icon from '../../components/ui/Icon'

export default function AdminHelp() {
    const [searchTerm, setSearchTerm] = useState('')
    const [activeSection, setActiveSection] = useState('getting-started')

    const helpSections = [
        {
            id: 'getting-started',
            title: 'Comenzando',
            icon: 'rocket_launch',
            content: [
                {
                    question: '¿Cómo accedo al panel de administrador?',
                    answer: 'Para acceder al panel de administrador, debes iniciar sesión con una cuenta que tenga rol de "admin". Una vez autenticado, verás el botón "Admin" en el header principal. Haz clic allí y selecciona la opción deseada.'
                },
                {
                    question: '¿Qué puedo hacer en el Dashboard?',
                    answer: 'El Dashboard muestra un resumen general de tu negocio incluyendo: total de usuarios, clientes activos, nuevos registros del mes, y una lista de los pedidos más recientes. Es el punto de partida para monitorear la actividad.'
                }
            ]
        },
        {
            id: 'clients',
            title: 'Gestión de Clientes',
            icon: 'groups',
            content: [
                {
                    question: '¿Cómo veo todos los clientes registrados?',
                    answer: 'Ve a la sección "Clientes" en el menú lateral. Allí verás una tabla con todos los usuarios registrados, incluyendo su información de contacto, fecha de registro y estado de la cuenta.'
                },
                {
                    question: '¿Cómo edito la información de un cliente?',
                    answer: 'En la tabla de clientes, haz clic en el botón "Editar" (icono de lápiz) junto al cliente que deseas modificar. Podrás actualizar su nombre, email, teléfono, empresa, RUT, rol y estado de la cuenta.'
                },
                {
                    question: '¿Cómo cambio el rol de un usuario a administrador?',
                    answer: 'Edita el perfil del cliente y en la sección "Configuración de Cuenta", cambia el campo "Rol" de "Cliente" a "Administrador". Guarda los cambios y el usuario tendrá acceso al panel de administración.'
                },
                {
                    question: '¿Qué significa desactivar una cuenta?',
                    answer: 'Desactivar una cuenta impide que el usuario pueda iniciar sesión en la plataforma. Sus datos se conservan pero no tendrá acceso hasta que se reactive la cuenta.'
                }
            ]
        },
        {
            id: 'statistics',
            title: 'Estadísticas',
            icon: 'bar_chart',
            content: [
                {
                    question: '¿Qué métricas puedo ver en Estadísticas?',
                    answer: 'La sección de Estadísticas muestra: distribución de usuarios por rol (clientes vs administradores), tasa de actividad, nuevos registros por mes, y los últimos usuarios registrados en la plataforma.'
                },
                {
                    question: '¿Cómo interpreto los datos de nuevos registros?',
                    answer: 'El gráfico de barras muestra la cantidad de nuevos usuarios que se registraron en cada uno de los últimos 6 meses. Esto te permite identificar tendencias de crecimiento y evaluar el impacto de tus campañas.'
                }
            ]
        },
        {
            id: 'faq',
            title: 'Preguntas Frecuentes',
            icon: 'quiz',
            content: [
                {
                    question: '¿Por qué no veo el botón de Admin?',
                    answer: 'El botón de Admin solo aparece para usuarios con rol "admin". Si eres administrador y no lo ves, contacta al equipo técnico para verificar tu rol en la base de datos.'
                },
                {
                    question: '¿Cómo creo un nuevo administrador?',
                    answer: 'Primero, el usuario debe registrarse en la plataforma como cliente. Luego, desde la sección "Clientes", edita su perfil y cambia su rol a "Administrador". Guarda los cambios y el usuario tendrá acceso al panel.'
                },
                {
                    question: '¿Los cambios se guardan automáticamente?',
                    answer: 'No, debes hacer clic en el botón "Guardar Cambios" después de modificar la información de un cliente. Recibirás una confirmación visual cuando los cambios se hayan aplicado correctamente.'
                }
            ]
        },
        {
            id: 'support',
            title: 'Soporte Técnico',
            icon: 'support_agent',
            content: [
                {
                    question: '¿Cómo contacto con soporte técnico?',
                    answer: 'Puedes contactarnos a través de:'
                }
            ],
            contactInfo: {
                email: 'soporte@eldescuevee.cl',
                phone: '+56 51 234 5678',
                whatsapp: '+56 9 8765 4321',
                hours: 'Lunes a Viernes, 09:00 - 18:00'
            }
        }
    ]

    const filteredSections = helpSections.filter(section =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const currentSection = helpSections.find(s => s.id === activeSection)

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                        <Icon name="help_outline" className="text-4xl" />
                        Centro de Ayuda
                    </h2>
                    <p className="text-on-surface-variant mt-1">
                        Guía rápida para el uso del panel de administración
                    </p>
                </div>

                {/* Buscador */}
                <div className="relative w-full sm:w-80">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Icon name="search" className="text-slate-400 text-sm" />
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar ayuda..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-outline-variant focus:ring-2 focus:ring-primary outline-none rounded-lg"
                    />
                </div>
            </div>

            {/* Contenido principal */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sidebar de secciones */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl border border-outline-variant sticky top-24 overflow-hidden">
                        <div className="p-4 bg-gradient-to-r from-primary to-primary-container text-white">
                            <h3 className="font-bold uppercase text-sm flex items-center gap-2">
                                <Icon name="menu_book" className="text-sm" />
                                Secciones
                            </h3>
                        </div>
                        <nav className="p-2 space-y-1">
                            {helpSections.map(section => (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left ${activeSection === section.id
                                        ? 'bg-primary/10 text-primary font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon name={section.icon} className="text-lg" />
                                    <span className="text-sm">{section.title}</span>
                                    {activeSection === section.id && (
                                        <span className="ml-auto w-1.5 h-1.5 bg-primary rounded-full"></span>
                                    )}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Contenido de la sección seleccionada */}
                <div className="lg:col-span-9">
                    <div className="bg-white rounded-xl border border-outline-variant overflow-hidden">
                        {/* Encabezado de sección */}
                        <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Icon name={currentSection?.icon} className="text-2xl text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-primary">{currentSection?.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        {currentSection?.id === 'getting-started' && 'Información básica para comenzar'}
                                        {currentSection?.id === 'clients' && 'Gestión y administración de clientes'}
                                        {currentSection?.id === 'statistics' && 'Interpretación de métricas y datos'}
                                        {currentSection?.id === 'faq' && 'Respuestas a preguntas comunes'}
                                        {currentSection?.id === 'support' && 'Canales de contacto y soporte'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Preguntas y respuestas */}
                        <div className="p-6 space-y-6">
                            {currentSection?.content.map((item, idx) => (
                                <div key={idx} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-[#FC9430]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-[#FC9430] text-xs font-bold">Q</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800 mb-2">{item.question}</h4>
                                            <div className="text-gray-600 text-sm leading-relaxed">
                                                {typeof item.answer === 'string' ? (
                                                    <p>{item.answer}</p>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {item.answer}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Información de contacto para soporte */}
                            {currentSection?.id === 'support' && currentSection.contactInfo && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                                    <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                                        <Icon name="contact_support" />
                                        Datos de Contacto
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                <Icon name="mail" className="text-sm text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Email</p>
                                                <a href={`mailto:${currentSection.contactInfo.email}`} className="text-sm font-medium text-primary hover:underline">
                                                    {currentSection.contactInfo.email}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                <Icon name="phone" className="text-sm text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Teléfono</p>
                                                <a href={`tel:${currentSection.contactInfo.phone}`} className="text-sm font-medium text-primary hover:underline">
                                                    {currentSection.contactInfo.phone}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                <Icon name="chat" className="text-sm text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">WhatsApp</p>
                                                <a href={`https://wa.me/${currentSection.contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
                                                    {currentSection.contactInfo.whatsapp}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                <Icon name="schedule" className="text-sm text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Horario</p>
                                                <p className="text-sm font-medium text-gray-700">{currentSection.contactInfo.hours}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}