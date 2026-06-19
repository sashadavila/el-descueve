// src/components/layout/AdminLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useState, useEffect } from 'react'
import Icon from '../../components/ui/Icon'
import api from '../../config/api'

const menuItems = [
    {
        title: 'Clientes',
        icon: 'groups',
        basePath: '/admin/clientes',
        notificationType: 'client', // ✅ Identificador para notificaciones de clientes
        subItems: [
            { path: '/admin/clientes/directorio', label: 'Directorio', icon: 'contact_page' },
            { path: '/admin/clientes/estadisticas', label: 'Estadísticas', icon: 'bar_chart' },
            { path: '/admin/clientes/notificaciones', label: 'Notificaciones', icon: 'notifications' },
        ]
    },
    {
        title: 'Inventarios',
        icon: 'inventory_2',
        basePath: '/admin/inventarios',
        notificationType: 'inventory', // ✅ Identificador para notificaciones de inventario
        subItems: [
            { path: '/admin/inventarios/directorio', label: 'Directorio', icon: 'inventory' },
            { path: '/admin/inventarios/estadisticas', label: 'Estadísticas', icon: 'bar_chart' },
            { path: '/admin/inventarios/notificaciones', label: 'Notificaciones', icon: 'notifications' },
        ]
    },
    {
        title: 'Pedidos',
        icon: 'receipt_long',
        basePath: '/admin/pedidos',
        notificationType: 'order', // ✅ Identificador para notificaciones de pedidos
        subItems: [
            { path: '/admin/pedidos/directorio', label: 'Directorio', icon: 'list_alt' },
            { path: '/admin/pedidos/estadisticas', label: 'Estadísticas', icon: 'bar_chart' },
            { path: '/admin/pedidos/notificaciones', label: 'Notificaciones', icon: 'notifications' },
        ]
    },
    {
        title: 'Envíos',
        icon: 'local_shipping',
        basePath: '/admin/envios',
        notificationType: 'shipment', // ✅ Identificador para notificaciones de envíos
        subItems: [
            { path: '/admin/envios/directorio', label: 'Directorio', icon: 'local_shipping' },
            { path: '/admin/envios/estadisticas', label: 'Estadísticas', icon: 'bar_chart' },
            { path: '/admin/envios/notificaciones', label: 'Notificaciones', icon: 'notifications' },
        ]
    },
    {
        title: 'Ayuda',
        icon: 'help_outline',
        basePath: '/admin/ayuda',
        notificationType: null,
        subItems: [
            { path: '/admin/ayuda', label: 'Centro de Ayuda', icon: 'support_agent' },
        ]
    },
]

export default function AdminLayout() {
    const location = useLocation()
    const navigate = useNavigate()
    const { isAdmin, isAuthenticated, loading, user } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [expandedMenus, setExpandedMenus] = useState({})
    const [currentTime, setCurrentTime] = useState('')

    // ✅ Contadores específicos por zona
    const [clientUnreadCount, setClientUnreadCount] = useState(0)
    const [inventoryUnreadCount, setInventoryUnreadCount] = useState(0)
    const [orderUnreadCount, setOrderUnreadCount] = useState(0)
    const [shipmentUnreadCount, setShipmentUnreadCount] = useState(0)

    // Determinar qué menú está expandido basado en la ruta actual
    useEffect(() => {
        const expanded = {}
        menuItems.forEach(menu => {
            if (location.pathname.startsWith(menu.basePath)) {
                expanded[menu.title] = true
            }
        })
        setExpandedMenus(expanded)
    }, [location.pathname])

    // ✅ Función para obtener contadores específicos por zona
    const fetchNotificationCounts = async () => {
        try {
            // Obtener todas las notificaciones no leídas
            const allNotifsResult = await api.notifications.getAll('unread', 1, 1000)
            const unreadNotifications = allNotifsResult.data || []

            // Contar por zona usando filtros específicos
            // 1. CLIENTES: new_user, inactive_user, admin_user
            const clientNotifications = unreadNotifications.filter(n =>
                n.type === 'new_user' ||
                n.type === 'inactive_user' ||
                n.type === 'admin_user'
            )
            setClientUnreadCount(clientNotifications.length)

            // 2. INVENTARIOS: system_alert con productos o stock
            const inventoryNotifications = unreadNotifications.filter(n =>
                n.type === 'system_alert' &&
                (n.title?.toLowerCase().includes('stock') ||
                    n.title?.toLowerCase().includes('producto') ||
                    n.title?.toLowerCase().includes('inventario') ||
                    n.metadata?.productId)
            )
            setInventoryUnreadCount(inventoryNotifications.length)

            // 3. PEDIDOS: new_order
            const orderNotifications = unreadNotifications.filter(n =>
                n.type === 'new_order'
            )
            setOrderUnreadCount(orderNotifications.length)

            // 4. ENVÍOS: system_alert con trackingNumber o títulos de envíos
            const shipmentNotifications = unreadNotifications.filter(n =>
                (n.type === 'system_alert' && n.metadata?.trackingNumber) ||
                n.title?.toLowerCase().includes('envío') ||
                n.title?.toLowerCase().includes('despacho') ||
                n.title?.toLowerCase().includes('entrega') ||
                n.title?.toLowerCase().includes('seguimiento') ||
                n.title?.toLowerCase().includes('tracking') ||
                n.title?.toLowerCase().includes('pedido recibido') ||
                n.title?.toLowerCase().includes('en preparación') ||
                n.title?.toLowerCase().includes('en tránsito') ||
                n.title?.toLowerCase().includes('entregado')
            )
            setShipmentUnreadCount(shipmentNotifications.length)

            console.log('📊 Contadores de notificaciones:')
            console.log('  Clientes:', clientNotifications.length)
            console.log('  Inventarios:', inventoryNotifications.length)
            console.log('  Pedidos:', orderNotifications.length)
            console.log('  Envíos:', shipmentNotifications.length)

        } catch (error) {
            console.error('Error fetching notification counts:', error)
        }
    }

    // ✅ Escuchar actualizaciones del contador de notificaciones
    useEffect(() => {
        const handleUnreadCountUpdate = () => {
            fetchNotificationCounts()
        }

        window.addEventListener('unreadCountUpdate', handleUnreadCountUpdate)

        // Carga inicial
        fetchNotificationCounts()

        return () => {
            window.removeEventListener('unreadCountUpdate', handleUnreadCountUpdate)
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

    const toggleMenu = (menuTitle) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuTitle]: !prev[menuTitle]
        }))
    }

    // ✅ Función para obtener el contador según el tipo de zona
    const getNotificationCount = (notificationType) => {
        switch (notificationType) {
            case 'client':
                return clientUnreadCount
            case 'inventory':
                return inventoryUnreadCount
            case 'order':
                return orderUnreadCount
            case 'shipment':
                return shipmentUnreadCount
            default:
                return 0
        }
    }

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

    const userName = user?.name?.split(' ')[0] || 'Admin'
    const userEmail = user?.email || 'admin@eldescuevee.cl'

    const getCurrentPageTitle = () => {
        const path = location.pathname
        for (const menu of menuItems) {
            for (const subItem of menu.subItems) {
                if (subItem.path === path) {
                    return `${menu.title} - ${subItem.label}`
                }
            }
        }
        return 'Panel de Control'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Overlay para mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-[#163C7A] to-[#0f2a5c] shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 overflow-y-auto`}>
                {/* Logo */}
                <div className="px-6 py-8 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FC9430] rounded-xl flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined text-white text-2xl">token</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tighter">EL DESCUEVEE</h1>
                            <p className="text-[10px] text-[#FC9430] uppercase tracking-wider font-bold">Panel de Control</p>
                        </div>
                    </div>
                </div>

                {/* Perfil */}
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

                {/* Navegación principal con submenús */}
                <nav className="flex-1 px-4 py-6">
                    {menuItems.map((menu) => {
                        const isExpanded = expandedMenus[menu.title]
                        const hasActiveChild = menu.subItems.some(sub => location.pathname === sub.path)
                        const unreadCount = getNotificationCount(menu.notificationType)

                        return (
                            <div key={menu.title} className="mb-2">
                                <button
                                    onClick={() => toggleMenu(menu.title)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${hasActiveChild
                                        ? 'bg-[#FC9430]/20 text-white'
                                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-xl">{menu.icon}</span>
                                        <span className="font-semibold text-sm uppercase tracking-wide">{menu.title}</span>
                                        {/* ✅ Mostrar contador específico de la zona */}
                                        {unreadCount > 0 && (
                                            <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    <span className="material-symbols-outlined text-sm">
                                        {isExpanded ? 'expand_less' : 'expand_more'}
                                    </span>
                                </button>

                                {isExpanded && (
                                    <div className="ml-6 mt-1 space-y-1 border-l border-white/20">
                                        {menu.subItems.map((subItem) => {
                                            const isActive = location.pathname === subItem.path
                                            // ✅ Solo mostrar el contador en el subitem de Notificaciones
                                            const showCount = subItem.label === 'Notificaciones' && unreadCount > 0

                                            return (
                                                <Link
                                                    key={subItem.path}
                                                    to={subItem.path}
                                                    onClick={() => setSidebarOpen(false)}
                                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${isActive
                                                        ? 'bg-[#FC9430] text-white shadow-md'
                                                        : 'text-white/60 hover:text-white hover:bg-white/10'
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined text-sm">{subItem.icon}</span>
                                                    <span className="text-xs font-medium">{subItem.label}</span>
                                                    {showCount && (
                                                        <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                                                            {unreadCount}
                                                        </span>
                                                    )}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </nav>

                {/* Footer */}
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

            {/* Top Bar */}
            <header className="fixed top-0 right-0 left-0 md:left-80 h-16 bg-white border-b border-gray-200 z-30 flex justify-between items-center px-4 md:px-8 shadow-sm">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>

                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-[#163C7A]">
                        {getCurrentPageTitle()}
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                        <span className="material-symbols-outlined text-sm text-gray-500">schedule</span>
                        <span className="text-sm font-medium text-gray-700">{currentTime}</span>
                    </div>

                    <Link
                        to="/"
                        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">home</span>
                        <span className="hidden sm:inline text-sm font-medium">Inicio</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="md:ml-80 pt-20 px-4 md:px-8 pb-8 min-h-screen">
                <div className="max-w-[1400px] mx-auto">
                    <div className="animate-fade-in-up">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    )
}