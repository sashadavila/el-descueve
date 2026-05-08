import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import Icon from './Icon'
import { useState } from 'react'

export default function ProductCard({ product }) {
    const { addToCart } = useCart()
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="bg-white border border-outline-variant group hover:border-primary transition-all duration-300 flex flex-col relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {product.isNew && (
                    <span className="bg-green-600 text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter">
                        NUEVO
                    </span>
                )}
                {product.hasDiscount && (
                    <span className="bg-error text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter">
                        -{product.discount}% DCTO
                    </span>
                )}
                {product.isFeatured && !product.isNew && !product.hasDiscount && (
                    <span className="bg-primary text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter">
                        TOP VENTAS
                    </span>
                )}
                {product.inStock && !product.isNew && !product.hasDiscount && !product.isFeatured && (
                    <span className="bg-primary text-white px-3 py-1 text-[10px] font-black uppercase tracking-tighter">
                        DISPONIBLE
                    </span>
                )}
            </div>

            {/* Imagen */}
            <Link to={`/producto/${product.id}`}>
                <div className="aspect-square overflow-hidden bg-surface-container-low p-6">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </Link>

            {/* Información */}
            <div className="p-6 flex flex-col flex-1">
                <p className="text-label-sm text-on-surface-variant mb-1 uppercase">{product.subcategory || product.category}</p>
                <Link to={`/producto/${product.id}`}>
                    <h3 className="font-h3 text-lg text-primary mb-2 group-hover:text-secondary transition-colors uppercase line-clamp-2">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-xs text-on-surface-variant mb-4 line-clamp-2">
                    {product.description}
                </p>

                {/* Especificaciones rápidas */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {product.embroidery?.included && (
                        <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase font-bold">
                            Bordado Incluido
                        </span>
                    )}
                    {product.reinforcement && (
                        <span className="text-[9px] bg-secondary-container/10 text-secondary-container px-2 py-0.5 rounded-full uppercase font-bold">
                            Reforzado
                        </span>
                    )}
                    {product.reflective && (
                        <span className="text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full uppercase font-bold">
                            Reflectante
                        </span>
                    )}
                    {product.thermal && (
                        <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase font-bold">
                            Térmico
                        </span>
                    )}
                </div>

                <div className="mt-auto flex justify-between items-end">
                    <div className="flex flex-col">
                        {product.hasDiscount ? (
                            <>
                                <span className="text-[10px] text-on-surface-variant line-through">${(product.price * (1 + product.discount / 100)).toLocaleString()} CLP</span>
                                <span className="text-h3 text-[#FC9430] font-black">${product.price.toLocaleString()} CLP</span>
                            </>
                        ) : (
                            <span className="text-h3 text-[#FC9430] font-black">${product.price.toLocaleString()} CLP</span>
                        )}
                        <span className="text-[10px] text-on-surface-variant">Desde {product.minOrder} unidades</span>
                    </div>
                    <button
                        onClick={() => addToCart(product, product.minOrder)}
                        className="w-10 h-10 bg-[#FC9430] text-white flex items-center justify-center hover:brightness-110 transition-colors rounded-full"
                    >
                        <Icon name="shopping_cart" className="text-sm" />
                    </button>
                </div>
            </div>

            {/* Botones overlay al hover */}
            {isHovered && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 transition-all">
                    <Link
                        to={`/producto/${product.id}`}
                        className="bg-white text-primary px-4 py-2 text-xs font-bold uppercase hover:bg-primary hover:text-white transition-colors rounded"
                    >
                        Ver Detalles
                    </Link>
                    <button
                        onClick={() => addToCart(product, product.minOrder)}
                        className="bg-[#FC9430] text-white px-4 py-2 text-xs font-bold uppercase hover:brightness-110 transition-colors rounded"
                    >
                        Cotizar
                    </button>
                </div>
            )}
        </div>
    )
}