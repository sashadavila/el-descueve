// src/pages/public/ProductDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../../components/ui/Icon'
import EmbroideryForm from '../../components/ui/EmbroideryForm'
import api from '../../config/api'

export default function ProductDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToCart } = useCart()
    const { isAuthenticated, loading: authLoading } = useAuth()
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(10)
    const [selectedColor, setSelectedColor] = useState('')
    const [selectedSize, setSelectedSize] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [embroideryData, setEmbroideryData] = useState(null)
    const [showEmbroideryForm, setShowEmbroideryForm] = useState(false)

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return

            setLoading(true)
            setError(null)

            try {
                const data = await api.products.getById(id)
                setProduct(data)

                if (data.colors && data.colors.length > 0) {
                    setSelectedColor(data.colors[0])
                }
                if (data.sizes && data.sizes.length > 0) {
                    setSelectedSize(data.sizes[0])
                }
                if (data.minOrder) {
                    setQuantity(data.minOrder)
                }
            } catch (err) {
                console.error('Error fetching product:', err)
                setError(err.message || 'Error al cargar el producto')
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
        window.scrollTo(0, 0)
    }, [id])

    const handleSaveEmbroidery = (data) => {
        console.log('🎨 [ProductDetail] Bordado guardado:', data)
        setEmbroideryData(data)
        setShowEmbroideryForm(false)
    }

    const handleRemoveEmbroidery = () => {
        console.log('🎨 [ProductDetail] Bordado eliminado')
        setEmbroideryData(null)
    }

    const handleAddToCart = () => {
        console.log('\n========== AGREGANDO AL CARRITO ==========')
        console.log('Producto:', product?.name)
        console.log('Cantidad:', quantity)
        console.log('Color seleccionado:', selectedColor)
        console.log('Talla seleccionada:', selectedSize)
        console.log('Datos de bordado:', embroideryData)
        console.log('¿Tiene bordado?', embroideryData ? 'SÍ' : 'NO')

        if (product) {
            const cartProduct = {
                id: product.id,
                name: product.name,
                reference: product.reference,
                price: product.price,
                image: product.imageUrl || product.images?.[0] || 'https://via.placeholder.com/400',
                minOrder: product.minOrder,
                selectedColor: selectedColor,
                selectedSize: selectedSize,
                embroidery: embroideryData  // ← Asegurar que esto NO sea null si hay bordado
            }

            console.log('📦 Producto a agregar al carrito:', cartProduct)
            console.log('📦 embroidery en cartProduct:', cartProduct.embroidery)

            addToCart(cartProduct, quantity)
            console.log('✅ Producto agregado al carrito')
            console.log('==========================================\n')

            navigate('/carrito')
        }
    }

    const handleCotizar = () => {
        const whatsappMessage = `Hola, quisiera cotizar el producto: ${product?.name} (Ref: ${product?.reference}). Cantidad: ${quantity} unidades. Color: ${selectedColor}, Talla: ${selectedSize}${embroideryData ? `\n\n*Bordado personalizado:*\n- Posiciones: ${embroideryData.positions.join(', ')}\n- Puntadas: ${embroideryData.maxStitches.toLocaleString()}\n- Colores: ${embroideryData.colors}\n- Archivo: ${embroideryData.logoFilename}` : ''
            }`
        window.open(`https://wa.me/56987654321?text=${encodeURIComponent(whatsappMessage)}`, '_blank')
    }

    if (authLoading || loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-on-surface-variant">Cargando producto...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        navigate('/login', { state: { from: `/producto/${id}` } })
        return null
    }

    if (error || !product) {
        return (
            <div className="max-w-[1280px] mx-auto px-8 py-20 text-center">
                <Icon name="search_off" className="text-6xl text-slate-300 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-primary mb-4">Producto no encontrado</h1>
                <p className="text-on-surface-variant mb-8">
                    {error || 'El producto que buscas no existe o ha sido eliminado.'}
                </p>
                <Link to="/catalogo" className="bg-[#FC9430] text-white px-6 py-3 font-bold uppercase inline-block hover:bg-[#e0852b] transition-colors">
                    Volver al Catálogo
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-[1280px] mx-auto px-8 py-8">
            <nav className="flex mb-8 items-center gap-2 text-on-surface-variant text-xs uppercase flex-wrap">
                <Link to="/" className="hover:text-primary">Inicio</Link>
                <Icon name="chevron_right" className="text-sm" />
                <Link to="/catalogo" className="hover:text-primary">Catálogo</Link>
                <Icon name="chevron_right" className="text-sm" />
                <span className="text-primary font-bold">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7">
                    <div className="aspect-square bg-white border border-outline-variant overflow-hidden rounded-lg">
                        <img
                            src={product.imageUrl || (product.images && product.images[0]) || 'https://via.placeholder.com/500?text=Sin+Imagen'}
                            alt={product.name}
                            className="w-full h-full object-contain p-8"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/500?text=Sin+Imagen'
                            }}
                        />
                    </div>
                    {product.images && product.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4 mt-4">
                            {product.images.map((img, idx) => (
                                <div key={idx} className="aspect-square border border-outline-variant overflow-hidden cursor-pointer hover:border-primary transition-colors rounded">
                                    <img
                                        src={img}
                                        alt={`${product.name} - vista ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/100?text=Error'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-5 flex flex-col gap-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2 uppercase">{product.name}</h1>
                        <p className="text-label-sm text-on-surface-variant mb-2 uppercase">Ref: {product.reference}</p>
                        <div className="flex items-center gap-4 mb-4 flex-wrap">
                            <span className="text-2xl md:text-3xl font-bold text-[#FC9430]">${product.price.toLocaleString()} CLP</span>
                            {product.hasDiscount && product.comparePrice && (
                                <span className="text-sm text-on-surface-variant line-through">${product.comparePrice.toLocaleString()} CLP</span>
                            )}
                            {product.embroidery?.included && (
                                <div className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1">
                                    <Icon name="local_laundry_service" className="text-sm" />
                                    Bordado incluido
                                </div>
                            )}
                        </div>
                        <p className="text-on-surface-variant border-l-4 border-[#FC9430] pl-4">{product.description}</p>
                    </div>

                    {product.colors && product.colors.length > 0 && (
                        <div>
                            <span className="block text-xs uppercase tracking-wider text-outline mb-3">Color</span>
                            <div className="flex gap-3 flex-wrap">
                                {product.colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color
                                            ? 'border-primary ring-2 ring-offset-2 ring-primary'
                                            : 'border-transparent hover:border-gray-300'
                                            }`}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {product.sizes && product.sizes.length > 0 && (
                        <div>
                            <span className="block text-xs uppercase tracking-wider text-outline mb-3">Talla</span>
                            <select
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                className="w-full h-12 border border-outline-variant px-4 font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white rounded"
                            >
                                {product.sizes.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <span className="block text-xs uppercase tracking-wider text-outline mb-3">
                            Cantidad (pedido mínimo: {product.minOrder || 10} unidades)
                        </span>
                        <div className="flex items-center border border-outline-variant w-max h-12 bg-white rounded">
                            <button
                                onClick={() => setQuantity(Math.max(product.minOrder || 10, quantity - (product.minOrder || 10)))}
                                className="px-4 h-full hover:bg-surface-container-low transition-colors rounded-l"
                            >
                                <Icon name="remove" className="text-sm" />
                            </button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(product.minOrder || 10, parseInt(e.target.value) || (product.minOrder || 10)))}
                                className="w-20 h-full text-center border-none focus:ring-0 font-bold"
                                min={product.minOrder || 10}
                                step={product.minOrder || 10}
                            />
                            <button
                                onClick={() => setQuantity(quantity + (product.minOrder || 10))}
                                className="px-4 h-full hover:bg-surface-container-low transition-colors rounded-r"
                            >
                                <Icon name="add" className="text-sm" />
                            </button>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-2">
                            *Pedido mínimo: {product.minOrder || 10} unidades combinables (mezcla de tallas y colores)
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <button
                            onClick={handleAddToCart}
                            className="h-14 bg-[#FC9430] text-white font-bold uppercase tracking-widest w-full hover:bg-[#e0852b] transition-all flex items-center justify-center gap-2 rounded"
                        >
                            <Icon name="shopping_basket" />
                            Agregar al Carrito
                        </button>
                        <button
                            onClick={handleCotizar}
                            className="h-14 border-2 border-[#25D366] text-[#25D366] font-bold uppercase tracking-widest w-full hover:bg-[#25D366] hover:text-white transition-all flex items-center justify-center gap-2 rounded"
                        >
                            <Icon name="chat" />
                            Cotizar por WhatsApp
                        </button>
                    </div>

                    {product.embroidery?.included && (
                        <div className="bg-surface-container-low border border-outline-variant p-6 mt-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <Icon name="brush" className="text-[#FC9430]" />
                                <h3 className="text-lg font-bold uppercase">Bordado de Logo Profesional</h3>
                            </div>

                            {!showEmbroideryForm && !embroideryData ? (
                                <>
                                    <p className="text-sm text-on-surface-variant mb-4">
                                        Incluye bordado de tu logo en todas las prendas. Completa el formulario para personalizar tu pedido.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                                        <div>
                                            <span className="font-bold">Puntadas máximas:</span>
                                            <p>{product.embroidery.maxStitches?.toLocaleString()} puntadas</p>
                                        </div>
                                        <div>
                                            <span className="font-bold">Colores disponibles:</span>
                                            <p>Hasta {product.embroidery.colors} colores</p>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="font-bold">Posiciones disponibles:</span>
                                            <p>{product.embroidery.positions?.join(', ')}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowEmbroideryForm(true)}
                                        className="w-full bg-primary text-white py-3 font-bold uppercase rounded-lg hover:bg-primary/80 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Icon name="edit_note" />
                                        Personalizar Bordado
                                    </button>
                                </>
                            ) : embroideryData ? (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm font-bold text-green-700 flex items-center gap-1">
                                                <Icon name="check_circle" className="text-sm" />
                                                Bordado personalizado agregado
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {embroideryData.positions?.join(', ')} |
                                                {embroideryData.maxStitches?.toLocaleString()} puntadas |
                                                {embroideryData.colors} colores
                                            </p>
                                            {embroideryData.logoFilename && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Logo: {embroideryData.logoFilename}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={handleRemoveEmbroidery}
                                            className="text-xs text-red-500 hover:text-red-700"
                                        >
                                            <Icon name="delete" className="text-sm" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setShowEmbroideryForm(true)}
                                        className="w-full bg-gray-100 text-primary py-2 font-bold uppercase rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Icon name="edit_note" />
                                        Modificar Bordado
                                    </button>
                                </div>
                            ) : (
                                <EmbroideryForm
                                    product={product}
                                    onSuccess={handleSaveEmbroidery}
                                    onCancel={() => setShowEmbroideryForm(false)}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-12 border-t pt-8">
                <h3 className="font-bold text-xl text-primary mb-6">Especificaciones Técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <table className="w-full border-collapse">
                        <tbody>
                            {product.material && (
                                <tr className="border-b border-outline-variant">
                                    <td className="py-3 text-xs uppercase text-outline w-1/3 font-bold">Material</td>
                                    <td className="py-3 text-sm">{product.material}</td>
                                </tr>
                            )}
                            {product.weight && (
                                <tr className="border-b border-outline-variant">
                                    <td className="py-3 text-xs uppercase text-outline font-bold">Peso</td>
                                    <td className="py-3 text-sm">{product.weight}</td>
                                </tr>
                            )}
                            {product.colors && product.colors.length > 0 && (
                                <tr className="border-b border-outline-variant">
                                    <td className="py-3 text-xs uppercase text-outline font-bold">Colores</td>
                                    <td className="py-3 text-sm">{product.colors.length} colores disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <table className="w-full border-collapse">
                        <tbody>
                            <tr className="border-b border-outline-variant">
                                <td className="py-3 text-xs uppercase text-outline w-1/3 font-bold">Pedido mínimo</td>
                                <td className="py-3 text-sm font-bold">{product.minOrder || 10} unidades combinables</td>
                            </tr>
                            {product.sizes && product.sizes.length > 0 && (
                                <tr className="border-b border-outline-variant">
                                    <td className="py-3 text-xs uppercase text-outline font-bold">Tallas</td>
                                    <td className="py-3 text-sm">{product.sizes.join(', ')}</td>
                                </tr>
                            )}
                            <tr className="border-b border-outline-variant">
                                <td className="py-3 text-xs uppercase text-outline font-bold">Zona de atención</td>
                                <td className="py-3 text-sm">Desde La Serena hasta Calbuco</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}