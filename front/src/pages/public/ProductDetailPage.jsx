import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { products } from '../../data/mockData'
import { useCart } from '../../hooks/useCart'

export default function ProductDetailPage() {
    const { id } = useParams()
    const product = products.find(p => p.id === parseInt(id))
    const { addToCart } = useCart()
    const [quantity, setQuantity] = useState(10)
    const [selectedColor, setSelectedColor] = useState(product?.colors[0])
    const [selectedSize, setSelectedSize] = useState('M')

    if (!product) {
        return <div className="text-center py-20">Producto no encontrado</div>
    }

    return (
        <div className="max-w-[1280px] mx-auto px-8 py-8">
            {/* Breadcrumbs */}
            <nav className="flex mb-8 items-center gap-2 text-on-surface-variant text-xs uppercase">
                <Link to="/" className="hover:text-primary">Inicio</Link>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <Link to="/catalogo" className="hover:text-primary">Catálogo</Link>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="text-primary font-bold">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Gallery */}
                <div className="lg:col-span-7">
                    <div className="aspect-square bg-white border border-outline-variant overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* Product Info */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-primary mb-2 uppercase">{product.name}</h1>
                        <div className="flex items-center gap-4 mb-4 flex-wrap">
                            <span className="text-2xl font-bold text-[#FC9430]">${product.price.toLocaleString()}</span>
                            <div className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">local_laundry_service</span>
                                Bordado incluido
                            </div>
                        </div>
                        <p className="text-on-surface-variant border-l-4 border-[#FC9430] pl-4">{product.description}</p>
                    </div>

                    {/* Color selector */}
                    <div>
                        <span className="block text-xs uppercase tracking-wider text-outline mb-3">Color</span>
                        <div className="flex gap-3">
                            {product.colors.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-10 h-10 rounded-full border-2 ${selectedColor === color ? 'border-primary ring-2 ring-offset-2 ring-primary' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Size selector */}
                    <div>
                        <span className="block text-xs uppercase tracking-wider text-outline mb-3">Talla</span>
                        <select
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                            className="w-full h-12 border border-outline-variant px-4 font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
                        >
                            {product.sizes.map(size => (
                                <option key={size}>{size}</option>
                            ))}
                        </select>
                    </div>

                    {/* Quantity */}
                    <div>
                        <span className="block text-xs uppercase tracking-wider text-outline mb-3">Cantidad (pedido mínimo: 10)</span>
                        <div className="flex items-center border border-outline-variant w-max h-12 bg-white">
                            <button
                                onClick={() => setQuantity(Math.max(10, quantity - 10))}
                                className="px-4 h-full hover:bg-surface-container-low transition-colors"
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(10, parseInt(e.target.value) || 10))}
                                className="w-20 h-full text-center border-none focus:ring-0"
                                min="10"
                                step="10"
                            />
                            <button
                                onClick={() => setQuantity(quantity + 10)}
                                className="px-4 h-full hover:bg-surface-container-low transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            onClick={() => addToCart(product, quantity)}
                            className="h-14 bg-[#FC9430] text-white font-bold uppercase tracking-widest w-full hover:bg-[#e0852b] transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">shopping_basket</span>
                            Solicitar Cotización
                        </button>
                        <a
                            href="https://wa.me/56912345678"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-14 border-2 border-[#25D366] text-[#25D366] font-bold uppercase tracking-widest w-full hover:bg-[#25D366] hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">chat</span>
                            Cotizar por WhatsApp
                        </a>
                    </div>

                    {/* Bordado info */}
                    <div className="bg-surface-container-low border border-outline-variant p-6 mt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined text-[#FC9430]">brush</span>
                            <h3 className="text-lg font-bold uppercase">Bordado de Logo Profesional</h3>
                        </div>
                        <p className="text-sm text-on-surface-variant mb-4">Incluye bordado de tu logo en todas las prendas.</p>
                        <div className="border-2 border-dashed border-outline-variant p-8 text-center bg-white hover:border-primary transition-colors cursor-pointer">
                            <span className="material-symbols-outlined text-4xl text-outline mb-2">upload_file</span>
                            <p className="text-xs uppercase">Sube tu logo (SVG, PNG, AI, PDF)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Specs */}
            <div className="mt-20 border-t-2 border-surface-container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-12">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Descripción</h3>
                        <p className="text-on-surface-variant">{product.description}</p>
                        <ul className="mt-6 space-y-3">
                            <li className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-[#FC9430] text-sm">check_circle</span>
                                <span className="text-sm font-semibold">{product.material}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-[#FC9430] text-sm">check_circle</span>
                                <span className="text-sm font-semibold">Bordado de logo profesional incluido</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-[#FC9430] text-sm">check_circle</span>
                                <span className="text-sm font-semibold">Pedido mínimo: {product.minOrder} unidades combinables</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-[#FC9430] text-sm">check_circle</span>
                                <span className="text-sm font-semibold">Atención desde La Serena hasta Calbuco</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Especificaciones</h3>
                        <table className="w-full border-collapse">
                            <tbody>
                                <tr className="border-b border-outline-variant">
                                    <td className="py-3 text-xs uppercase text-outline w-1/3">Material</td>
                                    <td className="py-3 text-sm">{product.material}</td>
                                </tr>
                                <tr className="border-b border-outline-variant">
                                    <td className="py-3 text-xs uppercase text-outline">Colores disponibles</td>
                                    <td className="py-3 text-sm">{product.colors.length} colores</td>
                                </tr>
                                <tr className="border-b border-outline-variant">
                                    <td className="py-3 text-xs uppercase text-outline">Pedido mínimo</td>
                                    <td className="py-3 text-sm font-bold">{product.minOrder} unidades combinables</td>
                                </tr>
                                <tr className="border-b border-outline-variant">
                                    <td className="py-3 text-xs uppercase text-outline">Zona de atención</td>
                                    <td className="py-3 text-sm">Desde La Serena hasta Calbuco</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}