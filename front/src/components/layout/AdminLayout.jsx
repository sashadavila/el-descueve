import { Outlet, Link, useLocation } from 'react-router-dom'

const navItems = [
    { path: '/admin', label: 'Resumen de Pedidos', icon: 'receipt_long' },
    { path: '/admin/clientes', label: 'Clientes', icon: 'groups' },
    { path: '/admin/estadisticas', label: 'Estadísticas', icon: 'bar_chart' },
]

export default function AdminLayout() {
    const location = useLocation()

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 border-r border-slate-200 bg-white flex flex-col py-6 z-40">
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
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHpHZiL9aBweXosRUkOXjv9Ohxw9Q7jFvHsvEL_S1idoGpHk3AFxuLQK-W9OYPnvCB3-nVCmNmLJ75ydlbPJ_myYf3S6LsmTQgvVkTr23I8ZoE8dkjKqHIEm4jOgurxr5OGaeHvRWyhgIkcjDE1at2Qa-o9Q_1yTrm8OMp516wqvnNJ9rAI8lpGvWVv5dcONpo76LgAwP4NBeBe1izHXj8Kc5jRJ6P9U6O9XZsPuMVX4EavG7qIbtIQdlE67eEVpv1EPn9KCPAgfc"
                                alt="Admin"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-on-background">Marcos Gutiérrez</p>
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
            <header className="fixed top-0 right-0 left-64 h-16 border-b-2 border-slate-100 bg-white z-30 flex justify-between items-center px-8">
                <div className="flex items-center gap-4 w-1/3">
                    <div className="relative w-full max-w-xs">
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
                    <button className="text-slate-600 hover:text-[#FC9430] transition-colors">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <Link to="/" className="text-slate-600 hover:text-[#FC9430] transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined">home</span>
                        <span className="hidden sm:inline text-sm">Inicio</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="ml-64 pt-20 px-6 pb-8 min-h-screen">
                <div className="max-w-[1280px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}