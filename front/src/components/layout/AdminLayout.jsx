import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useEffect } from 'react'

const navItems = [
    { path: '/admin', label: 'Dashboard', icon: 'dashboard' },
    { path: '/admin/clientes', label: 'Clientes', icon: 'groups' },
    { path: '/admin/estadisticas', label: 'Estadísticas', icon: 'bar_chart' },
]

export default function AdminLayout() {
    const location = useLocation()
    const navigate = useNavigate()
    const { isAdmin, isAuthenticated, loading } = useAuth()

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!isAuthenticated || !isAdmin) {
        return null
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar - Versión mejorada para mobile/desktop */}
            <aside className="fixed left-0 top-0 h-full w-64 border-r border-slate-200 bg-white flex flex-col py-6 z-40 transform transition-transform -translate-x-full md:translate-x-0">
                <div className="px-6 mb-10">
                    <h1 className="text-xl font-black text-[#163C7A] tracking-tighter">EL DESCUVEE</h1>
                    <p className="uppercase tracking-wider text-xs font-bold text-slate-500">Panel de Control</p>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map(item => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-6 py-3 transition-colors ${isActive
                                    ? 'bg-slate-100 text-[#163C7A] border-l-4 border-[#163C7A]'
                                    : 'text-slate-500 hover:text-[#163C7A] hover:bg-slate-50'
                                    }`}
                            >
                                <span className="material-symbols-outlined mr-3">{item.icon}</span>
                                <span className="uppercase tracking-wider text-xs font-bold">{item.label}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="px-6 pt-6 mt-6 border-t border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                            <img
                                src="https://ui-avatars.com/api/?background=163C7A&color=fff&name=Admin"
                                alt="Admin"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-on-background">Administrador</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Admin Principal</p>
                        </div>
                    </div>

                    <Link
                        to="/"
                        className="mt-4 flex items-center gap-2 text-sm text-slate-500 hover:text-[#FC9430] transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        Volver al sitio
                    </Link>
                </div>
            </aside>

            {/* Top Bar */}
            <header className="fixed top-0 right-0 left-0 md:left-64 h-16 border-b-2 border-slate-100 bg-white z-30 flex justify-between items-center px-4 md:px-8">
                <div className="flex items-center gap-4 w-1/3">
                    <button
                        className="md:hidden text-slate-600 hover:text-primary"
                        onClick={() => {
                            const sidebar = document.querySelector('aside')
                            sidebar?.classList.toggle('-translate-x-full')
                        }}
                    >
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <div className="relative w-full max-w-xs hidden md:block">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar pedidos..."
                            className="w-full bg-slate-50 border border-slate-200 py-1.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary-container outline-none rounded"
                        />
                    </div>
                </div>

                <div className="text-lg font-bold text-[#163C7A] hidden lg:block">
                    El Descuevee - Panel de Administración
                </div>

                <div className="flex items-center gap-4">
                    <button className="text-slate-600 hover:text-[#FC9430] transition-colors relative">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <Link to="/" className="text-slate-600 hover:text-[#FC9430] transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined">home</span>
                        <span className="hidden sm:inline text-sm">Inicio</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="md:ml-64 pt-20 px-4 md:px-6 pb-8 min-h-screen">
                <div className="max-w-[1280px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}