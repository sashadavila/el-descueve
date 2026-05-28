import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useState, useEffect } from 'react'
import api from '../../config/api'

const navItems = [
    { path: '/admin', label: 'Dashboard', icon: 'dashboard', description: 'Resumen y métricas' },
    { path: '/admin/clientes', label: 'Clientes', icon: 'groups', description: 'Gestión de clientes' },
    { path: '/admin/estadisticas', label: 'Estadísticas', icon: 'bar_chart', description: 'Análisis de datos' },
]

export default function AdminLayout() {
    const location = useLocation()
    const navigate = useNavigate()
    const { isAdmin, isAuthenticated, loading, user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [currentTime, setCurrentTime] = useState('')
    const [unreadCount, setUnreadCount] = useState(0)

    // Escuchar actualizaciones del contador de notificaciones
    useEffect(() => {
        const handleUnreadCountUpdate = (event) => {
            setUnreadCount(event.detail.count)
        }

        window.addEventListener('unreadCountUpdate', handleUnreadCountUpdate)

        // Actualizar contador periódicamente
        const interval = setInterval(async () => {
            try {
                const { count } = await api.notifications.getUnreadCount()
                setUnreadCount(count)
            } catch (error) {
                console.error('Error fetching unread count:', error)
            }
        }, 30000) // Cada 30 segundos

        return () => {
            window.removeEventListener('unreadCountUpdate', handleUnreadCountUpdate)
            clearInterval(interval)
        }
    }, [])

    // Verificar permisos de admin
    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                navigate('/login', { state: { from: '/admin' } })
            } else if (!isAdmin) {
                navigate('/')
            }
        }
    }, [isAuthenticated, isAdmin, loading, navigate])

    // Actualizar hora actual
    useEffect(() => {
        const updateTime = () => {
            const now = new Date()
            const formattedTime = now.toLocaleTimeString('es-CL', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
            setCurrentTime(formattedTime)
        }
        updateTime()
        const interval = setInterval(updateTime, 1000)
        return () => clearInterval(interval)
    }, [])

    // Simular notificaciones no leídas (conectar con API real después)
    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                // Aquí puedes conectar con un endpoint real
                // const response = await api.notifications.getUnreadCount()
                // setUnreadCount(response.count)
                setUnreadCount(3) // Ejemplo temporal
            } catch (error) {
                console.error('Error fetching unread count:', error)
            }
        }
        fetchUnreadCount()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FC9430] mx-auto"></div>
                    <p className="mt-4 text-gray-500 font-medium">Cargando panel de control...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated || !isAdmin) {
        return null
    }

    // Obtener el nombre del usuario o usar "Administrador"
    const userName = user?.name?.split(' ')[0] || 'Admin'
    const userEmail = user?.email || 'admin@eldescuevee.cl'

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Overlay para mobile cuando el sidebar está abierto */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Versión mejorada */}
            <aside className={`fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-[#163C7A] to-[#0f2a5c] shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                {/* Logo y marca */}
                <div className="px-6 py-8 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FC9430] rounded-xl flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined text-white text-2xl">token</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tighter">EL DESCUVEE</h1>
                            <p className="text-[10px] text-[#FC9430] uppercase tracking-wider font-bold">Panel de Control</p>
                        </div>
                    </div>
                </div>

                {/* Perfil del usuario */}
                <div className="px-6 py-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FC9430] to-[#e0852b] flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">
                                    {userName.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#163C7A]"></div>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-white">{userName}</p>
                            <p className="text-[10px] text-white/60 truncate">{userEmail}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-[#FC9430]/20 text-[#FC9430] text-[8px] font-bold uppercase rounded-full">
                                Administrador
                            </span>
                        </div>
                    </div>
                </div>

                {/* Navegación principal */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navItems.map(item => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-[#FC9430] text-white shadow-lg'
                                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-xl ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                                    {item.icon}
                                </span>
                                <div className="flex-1">
                                    <div className="font-semibold text-sm uppercase tracking-wide">{item.label}</div>
                                    <div className={`text-[10px] ${isActive ? 'text-white/80' : 'text-white/40'}`}>
                                        {item.description}
                                    </div>
                                </div>
                                {isActive && (
                                    <span className="w-1.5 h-8 bg-white rounded-full"></span>
                                )}
                            </Link>
                        )
                    })}

                    {/* Separador */}
                    <div className="my-4 border-t border-white/10"></div>

                    {/* Notificaciones en sidebar */}
                    <Link
                        to="/admin/notificaciones"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === '/admin/notificaciones'
                            ? 'bg-[#FC9430] text-white shadow-lg'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-xl">notifications</span>
                        <div className="flex-1">
                            <div className="font-semibold text-sm uppercase tracking-wide">Notificaciones</div>
                            <div className="text-[10px] text-white/40">Actividad reciente</div>
                        </div>
                        {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </Link>

                    {/* Ayuda en sidebar */}
                    <Link
                        to="/admin/ayuda"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === '/admin/ayuda'
                            ? 'bg-[#FC9430] text-white shadow-lg'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <span className="material-symbols-outlined text-xl">help_outline</span>
                        <div className="flex-1">
                            <div className="font-semibold text-sm uppercase tracking-wide">Ayuda</div>
                            <div className="text-[10px] text-white/40">Guía y soporte</div>
                        </div>
                    </Link>
                </nav>

                {/* Footer del sidebar */}
                <div className="px-6 py-6 border-t border-white/10">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
                    >
                        <span className="material-symbols-outlined text-xl">storefront</span>
                        <div>
                            <div className="font-semibold text-sm">Ir a la tienda</div>
                            <div className="text-[10px] text-white/40">Volver al sitio principal</div>
                        </div>
                    </Link>
                </div>
            </aside>

            {/* Top Bar - Header mejorado */}
            <header className="fixed top-0 right-0 left-0 md:left-72 h-16 bg-white border-b border-gray-200 z-30 flex justify-between items-center px-4 md:px-8 shadow-sm">
                {/* Botón hamburguesa para mobile */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>

                {/* Título de la página actual */}
                <div className="flex items-center gap-3">
                    <div className="hidden md:block">
                        <h2 className="text-lg font-bold text-[#163C7A]">
                            {navItems.find(item => item.path === location.pathname)?.label ||
                                (location.pathname === '/admin/notificaciones' ? 'Notificaciones' :
                                    location.pathname === '/admin/ayuda' ? 'Ayuda' : 'Dashboard')}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {navItems.find(item => item.path === location.pathname)?.description ||
                                (location.pathname === '/admin/notificaciones' ? 'Actividad reciente y alertas' :
                                    location.pathname === '/admin/ayuda' ? 'Guía y soporte técnico' : 'Bienvenido al panel de administración')}
                        </p>
                    </div>
                </div>

                {/* Acciones del header */}
                <div className="flex items-center gap-4">
                    {/* Reloj */}
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                        <span className="material-symbols-outlined text-sm text-gray-500">schedule</span>
                        <span className="text-sm font-medium text-gray-700">{currentTime}</span>
                    </div>

                    {/* Notificaciones en header */}
                    <Link
                        to="/admin/notificaciones"
                        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined">notifications_none</span>
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                    </Link>

                    {/* Link a inicio */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">home</span>
                        <span className="hidden sm:inline text-sm font-medium">Inicio</span>
                    </Link>

                    {/* Botón de ayuda en header */}
                    <Link
                        to="/admin/ayuda"
                        className="hidden md:flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">help_outline</span>
                        <span className="text-sm font-medium">Ayuda</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="md:ml-72 pt-20 px-4 md:px-8 pb-8 min-h-screen">
                <div className="max-w-[1400px] mx-auto">
                    {/* Breadcrumb */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 text-sm">
                            <Link to="/admin" className="text-gray-500 hover:text-[#163C7A] transition-colors">Admin</Link>
                            <span className="material-symbols-outlined text-sm text-gray-400">chevron_right</span>
                            <span className="font-medium text-[#163C7A]">
                                {navItems.find(item => item.path === location.pathname)?.label ||
                                    (location.pathname === '/admin/notificaciones' ? 'Notificaciones' :
                                        location.pathname === '/admin/ayuda' ? 'Ayuda' : 'Dashboard')}
                            </span>
                        </div>
                    </div>

                    {/* Contenido principal con animación */}
                    <div className="animate-fade-in-up">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    )
}