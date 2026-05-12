import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Icon from './Icon'

export default function FeaturedProductCard({ product }) {
    const { isAuthenticated } = useAuth()

    return (
        <div className="bg-white border border-outline-variant group hover:border-primary transition-all duration-300 flex flex-col relative">
            <div className="absolute top-4 left-4 z-10">
                <span className="bg-primary text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter">
                    DISPONIBLE
                </span>
            </div>
            <Link to={isAuthenticated ? `/producto/${product.id}` : "/login"}>
                <div className="aspect-square overflow-hidden bg-surface-container-low p-8">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </Link>
            <div className="p-6 flex flex-col flex-1">
                <Link to={isAuthenticated ? `/producto/${product.id}` : "/login"}>
                    <h3 className="font-h3 text-lg text-primary mb-2 group-hover:text-secondary transition-colors uppercase line-clamp-2">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-xs text-on-surface-variant mb-4 line-clamp-2">
                    {product.description}
                </p>
                <div className="mt-auto flex justify-between items-end">
                    <div className="flex flex-col">
                        {isAuthenticated ? (
                            <span className="text-h3 text-[#FC9430] font-black">${product.price.toLocaleString()} CLP</span>
                        ) : (
                            <>
                                <span className="text-h3 text-[#FC9430] font-black">Inicia sesión</span>
                                <span className="text-[10px] text-on-surface-variant">Para ver precios</span>
                            </>
                        )}
                    </div>
                    <Link
                        to={isAuthenticated ? `/producto/${product.id}` : "/login"}
                        className="text-[10px] font-bold text-on-surface uppercase border-b border-primary hover:text-primary transition-colors"
                    >
                        {isAuthenticated ? "VER DETALLES" : "INICIAR SESIÓN"}
                    </Link>
                </div>
            </div>
        </div>
    )
}