import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'

export default function ProductCard({ product }) {
    const { addToCart } = useCart()

    return (
        <div className="bg-white border border-outline-variant p-4 group hover:shadow-lg transition-all">
            <Link to={`/producto/${product.id}`}>
                <div className="aspect-square bg-surface-container mb-4 relative overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.inStock && (
                        <span className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 uppercase">
                            Disponible
                        </span>
                    )}
                </div>
                <h3 className="font-bold text-primary mb-1 uppercase">{product.name}</h3>
                <p className="text-on-surface-variant text-sm mb-4 line-clamp-2">{product.description}</p>
            </Link>
            <div className="flex justify-between items-center">
                <span className="text-primary font-bold text-lg">${product.price.toLocaleString()}</span>
                <button
                    onClick={() => addToCart(product, 10)}
                    className="w-10 h-10 bg-[#FC9430] text-white flex items-center justify-center hover:brightness-110 transition-colors"
                >
                    <span className="material-symbols-outlined">shopping_cart</span>
                </button>
            </div>
        </div>
    )
}