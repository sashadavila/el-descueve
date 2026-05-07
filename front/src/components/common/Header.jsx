import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'

export default function Header() {
    const { getTotalItems } = useCart()
    const { user, logout, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <header className="bg-[#163C7A] sticky top-0 z-50 border-b-4 border-[#FC9430]">
            <div className="max-w-[1280px] mx-auto flex justify-between items-center px-4 sm:px-6 md:px-8 py-3 md:py-4">
                {/* Logo */}
                <Link to="/" className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">
                    EL DESCUVEE
                </Link>

                {/* Navegación Desktop */}
                <nav className="hidden md:flex gap-6 lg:gap-8">
                    <Link
                        to="/catalogo?categoria=corporativo"
                        className="text-white hover:text-[#FC9430] transition-colors font-bold uppercase tracking-wider text-sm"
                    >
                        Corporativo
                    </Link>
                    <Link
                        to="/catalogo?categoria=industrial"
                        className="text-white hover:text-[#FC9430] transition-colors font-bold uppercase tracking-wider text-sm"
                    >
                        Industrial
                    </Link>
                    <Link
                        to="/catalogo?categoria=bordados"
                        className="text-white hover:text-[#FC9430] transition-colors font-bold uppercase tracking-wider text-sm"
                    >
                        Bordados
                    </Link>
                    <Link
                        to="/catalogo"
                        className="text-white hover:text-[#FC9430] transition-colors font-bold uppercase tracking-wider text-sm"
                    >
                        Cotización
                    </Link>
                    <Link
                        to="/seguimiento/ELD-10254"
                        className="text-[#FC9430] border-b-2 border-[#FC9430] font-bold uppercase tracking-wider text-sm"
                    >
                        Seguir Pedido
                    </Link>
                </nav>

                {/* Acciones - Desktop */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* WhatsApp */}
                    <a
                        href="https://wa.me/56912345678?text=Hola,%20quisiera%20cotizar%20prendas%20corporativas"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-[#FC9430] transition-colors flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-xl sm:text-2xl">chat</span>
                        <span className="hidden sm:inline text-xs font-bold">WhatsApp</span>
                    </a>

                    {/* Carrito de compras */}
                    <button
                        onClick={() => navigate('/carrito')}
                        className="text-white hover:text-[#FC9430] transition-colors relative"
                    >
                        <span className="material-symbols-outlined text-xl sm:text-2xl">shopping_cart</span>
                        {getTotalItems() > 0 && (
                            <span className="absolute -top-2 -right-2 bg-[#FC9430] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                                {getTotalItems()}
                            </span>
                        )}
                    </button>

                    {/* Autenticación */}
                    {isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <span className="text-white text-xs lg:text-sm hidden lg:inline font-medium">
                                {user?.name?.split(' ')[0]}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="text-white hover:text-[#FC9430] transition-colors"
                                title="Cerrar sesión"
                            >
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

            {/* Navegación Mobile - Menú inferior */}
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
                    <button
                        onClick={() => navigate('/carrito')}
                        className="text-white hover:text-[#FC9430] transition-colors relative flex flex-col items-center"
                    >
                        <span className="material-symbols-outlined text-xl">shopping_cart</span>
                        {getTotalItems() > 0 && (
                            <span className="absolute -top-1 -right-2 bg-[#FC9430] text-white text-[8px] rounded-full w-3 h-3 flex items-center justify-center">
                                {getTotalItems()}
                            </span>
                        )}
                        <span className="text-[10px]">Carrito</span>
                    </button>
                    <a
                        href="https://wa.me/56912345678"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-[#FC9430] transition-colors flex flex-col items-center"
                    >
                        <span className="material-symbols-outlined text-xl">chat</span>
                        <span className="text-[10px]">WhatsApp</span>
                    </a>
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="text-white hover:text-[#FC9430] transition-colors flex flex-col items-center"
                        >
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

            {/* Espacio para el menú mobile (evita que el contenido quede detrás) */}
            <div className="md:hidden h-14"></div>
        </header>
    )
}