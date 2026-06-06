// src/components/ui/FeaturedProductCard.jsx
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Icon from './Icon'

export default function FeaturedProductCard({ product }) {
    const { isAuthenticated } = useAuth()

    // Asegurar que el producto tiene los campos necesarios
    const productId = product.id
    const productName = product.name || 'Producto'
    const productDescription = product.description || ''
    const productPrice = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0
    const productImage = product.image || product.imageUrl || 'https://via.placeholder.com/400'
    const productMinOrder = product.minOrder || 10

    return (
        <div className="bg-white border border-outline-variant group hover:border-primary transition-all duration-300 flex flex-col relative rounded-lg overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
                {product.isFeatured && (
                    <span className="bg-[#FC9430] text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded">
                        DESTACADO
                    </span>
                )}
                {!product.isFeatured && (
                    <span className="bg-primary text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter rounded">
                        DISPONIBLE
                    </span>
                )}
            </div>
            <Link to={isAuthenticated ? `/producto/${productId}` : "/login"}>
                <div className="aspect-square overflow-hidden bg-surface-container-low p-8">
                    <img
                        src={productImage}
                        alt={productName}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400?text=Sin+Imagen'
                        }}
                    />
                </div>
            </Link>
            <div className="p-6 flex flex-col flex-1">
                <Link to={isAuthenticated ? `/producto/${productId}` : "/login"}>
                    <h3 className="font-h3 text-lg text-primary mb-2 group-hover:text-secondary transition-colors uppercase line-clamp-2">
                        {productName}
                    </h3>
                </Link>
                <p className="text-xs text-on-surface-variant mb-4 line-clamp-2">
                    {productDescription}
                </p>
                <div className="mt-auto flex justify-between items-end">
                    <div className="flex flex-col">
                        {isAuthenticated ? (
                            <>
                                <span className="text-h3 text-[#FC9430] font-black">${productPrice.toLocaleString()} CLP</span>
                                <span className="text-[10px] text-on-surface-variant">Desde {productMinOrder} unidades</span>
                            </>
                        ) : (
                            <>
                                <span className="text-h3 text-[#FC9430] font-black">Inicia sesión</span>
                                <span className="text-[10px] text-on-surface-variant">Para ver precios</span>
                            </>
                        )}
                    </div>
                    <Link
                        to={isAuthenticated ? `/producto/${productId}` : "/login"}
                        className="text-[10px] font-bold text-on-surface uppercase border-b border-primary hover:text-primary transition-colors"
                    >
                        {isAuthenticated ? "VER DETALLES" : "INICIAR SESIÓN"}
                    </Link>
                </div>
            </div>
        </div>
    )
}