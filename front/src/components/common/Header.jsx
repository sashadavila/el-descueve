import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'

export default function Header() {
    const { getTotalItems } = useCart()
    const { user, logout, isAuthenticated, isAdmin } = useAuth()
    const navigate = useNavigate()
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false)
    const adminMenuRef = useRef(null)

    // Debug: Mostrar en consola el estado del usuario y rol
    useEffect(() => {
        console.log('========== HEADER DEBUG ==========')
        console.log('isAuthenticated:', isAuthenticated)
        console.log('isAdmin:', isAdmin)
        console.log('user object:', user)
        console.log('user role:', user?.role)
        console.log('===================================')
    }, [isAuthenticated, isAdmin, user])

    const handleLogout = () => {
        logout()
        navigate('/logout')
    }

    // Cerrar menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
                setIsAdminMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Opciones del menú de administrador
    const adminMenuItems = [
        { path: '/admin', label: 'Dashboard', icon: 'dashboard' },
    ]

    return (
        <header className="bg-[#163C7A] sticky top-0 z-50 border-b-4 border-[#FC9430]">
            <div className="max-w-[1280px] mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8 py-3 md:py-4">
                {/* Logo */}
                <Link to="/" className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">
                    EL DESCUEVEE
                </Link>

                {/* Navegación Desktop */}
                <nav className="hidden md:flex gap-6 lg:gap-8">
                    <Link to="/" className="text-white hover:text-[#FC9430] transition-colors font-bold uppercase tracking-wider text-sm">Inicio</Link>
                    <Link to="/nosotros" className="text-white hover:text-[#FC9430] transition-colors font-bold uppercase tracking-wider text-sm">Nosotros</Link>
                    <Link to="/catalogo" className="text-white hover:text-[#FC9430] transition-colors font-bold uppercase tracking-wider text-sm">Catalogo</Link>
                    <Link to="/contacto" className="text-white hover:text-[#FC9430] transition-colors font-bold uppercase tracking-wider text-sm">Contacto</Link>
                    <Link to="/seguimiento/ELD-10254" className="text-white hover:text-[#FC9430] transition-colors font-bold uppercase tracking-wider text-sm">Seguir Pedido</Link>
                </nav>

                {/* Acciones - Desktop */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* WhatsApp */}
                    <a href="https://wa.me/56912345678?text=Hola,%20quisiera%20cotizar%20prendas%20corporativas" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FC9430] transition-colors">
                        <span className="material-symbols-outlined text-xl sm:text-2xl">chat</span>
                    </a>

                    {/* Carrito */}
                    <button onClick={() => navigate('/carrito')} className="text-white hover:text-[#FC9430] transition-colors relative">
                        <span className="material-symbols-outlined text-xl sm:text-2xl">shopping_cart</span>
                        {getTotalItems() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#FC9430] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                {getTotalItems()}
                            </span>
                        )}
                    </button>

                    {/* BOTÓN DE ADMIN - Solo visible si es admin */}
                    {isAuthenticated && isAdmin === true && (
                        <div className="relative" ref={adminMenuRef}>
                            <button
                                onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                                className="bg-[#FC9430] text-[#163C7A] hover:bg-[#e0852b] transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold"
                            >
                                <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                                <span className="text-sm font-bold uppercase hidden lg:inline">Admin</span>
                                <span className="material-symbols-outlined text-sm">
                                    {isAdminMenuOpen ? 'expand_less' : 'expand_more'}
                                </span>
                            </button>

                            {/* Dropdown del menú admin */}
                            {isAdminMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
                                    <div className="py-2">
                                        <div className="px-4 py-3 border-b border-gray-100 bg-primary/5">
                                            <p className="text-xs text-gray-500 uppercase font-bold">Panel de Control</p>
                                            <p className="text-sm font-bold text-primary">{user?.name}</p>
                                            <p className="text-xs text-gray-400">{user?.email}</p>
                                            <div className="mt-1 inline-block bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                                                {user?.role}
                                            </div>
                                        </div>
                                        {adminMenuItems.map((item) => (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setIsAdminMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                                                <span className="font-medium">{item.label}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Login/Logout */}
                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <span className="text-white text-xs lg:text-sm hidden lg:inline font-medium">
                                {user?.name?.split(' ')[0]}
                            </span>
                            <button onClick={handleLogout} className="text-white hover:text-[#FC9430] transition-colors" title="Cerrar sesión">
                                <span className="material-symbols-outlined text-xl sm:text-2xl">logout</span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="text-white hover:text-[#FC9430] transition-colors">
                            <span className="material-symbols-outlined text-xl sm:text-2xl">login</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile bottom navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#163C7A] border-t-2 border-[#FC9430] z-50">
                <div className="flex justify-around items-center py-2">
                    <Link to="/" className="text-white hover:text-[#FC9430] transition-colors flex flex-col items-center">
                        <span className="material-symbols-outlined text-xl">home</span>
                        <span className="text-[10px]">Inicio</span>
                    </Link>
                    <Link to="/catalogo" className="text-white hover:text-[#FC9430] transition-colors flex flex-col items-center">
                        <span className="material-symbols-outlined text-xl">search</span>
                        <span className="text-[10px]">Catálogo</span>
                    </Link>
                    <button onClick={() => navigate('/carrito')} className="text-white hover:text-[#FC9430] transition-colors relative flex flex-col items-center">
                        <span className="material-symbols-outlined text-xl">shopping_cart</span>
                        {getTotalItems() > 0 && (
                            <span className="absolute -top-1 -right-2 bg-[#FC9430] text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center">
                                {getTotalItems()}
                            </span>
                        )}
                        <span className="text-[10px]">Carrito</span>
                    </button>
                    <a href="https://wa.me/56912345678" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#FC9430] transition-colors flex flex-col items-center">
                        <span className="material-symbols-outlined text-xl">chat</span>
                        <span className="text-[10px]">WhatsApp</span>
                    </a>
                    {isAuthenticated && isAdmin === true && (
                        <Link to="/admin" className="text-white hover:text-[#FC9430] transition-colors flex flex-col items-center">
                            <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
                            <span className="text-[10px]">Admin</span>
                        </Link>
                    )}
                    {isAuthenticated ? (
                        <button onClick={handleLogout} className="text-white hover:text-[#FC9430] transition-colors flex flex-col items-center">
                            <span className="material-symbols-outlined text-xl">logout</span>
                            <span className="text-[10px]">Salir</span>
                        </button>
                    ) : (
                        <Link to="/login" className="text-white hover:text-[#FC9430] transition-colors flex flex-col items-center">
                            <span className="material-symbols-outlined text-xl">login</span>
                            <span className="text-[10px]">Ingresar</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Espacio para el menú mobile */}
            <div className="md:hidden h-14"></div>
        </header>
    )
}