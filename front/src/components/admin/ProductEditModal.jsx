// src/components/admin/ProductEditModal.jsx
import { useState, useEffect } from 'react'
import Icon from '../ui/Icon'
import api from '../../config/api'

export default function ProductEditModal({ isOpen, onClose, product, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        reference: '',
        price: '',
        comparePrice: '',
        productType: 'corporativo',
        categoryId: '',
        subcategory: '',
        sizes: [],
        colors: [],
        material: '',
        weight: '',
        stock: '',
        minOrder: '',
        imageUrl: '',
        images: [],
        isActive: true,
        isNew: false,
        isFeatured: false,
        hasDiscount: false,
        discount: '',
        reinforcement: false,
        reflective: false,
        thermal: false,
        embroidery: {
            included: false,
            maxStitches: 15000,
            colors: 6,
            positions: ['Pecho izquierdo']
        },
        features: []
    })

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [colorInput, setColorInput] = useState('')
    const [imageInput, setImageInput] = useState('')
    const [featureInput, setFeatureInput] = useState('')
    const [availableSizes] = useState(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'])
    const [availableProductTypes] = useState([
        { value: 'corporativo', label: 'Corporativo' },
        { value: 'industrial', label: 'Industrial' },
        { value: 'bordados', label: 'Bordados' },
        { value: 'equipos', label: 'Equipos' }
    ])
    const [embroideryPositions] = useState([
        'Pecho izquierdo', 'Pecho derecho', 'Manga izquierda', 'Manga derecha', 'Espalda', 'Cuello', 'Caperuza'
    ])

    // Cargar categorías
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/categories`)
                if (response.ok) {
                    const data = await response.json()
                    setCategories(data)
                }
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }
        fetchCategories()
    }, [])

    // Cargar datos del producto cuando cambia
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                reference: product.reference || '',
                price: product.price || '',
                comparePrice: product.comparePrice || '',
                productType: product.productType || 'corporativo',
                categoryId: product.categoryId || '',
                subcategory: product.subcategory || '',
                sizes: product.sizes || ['S', 'M', 'L'],
                colors: product.colors || [],
                material: product.material || '',
                weight: product.weight || '',
                stock: product.stock || '',
                minOrder: product.minOrder || '',
                imageUrl: product.imageUrl || '',
                images: product.images || [],
                isActive: product.isActive !== undefined ? product.isActive : true,
                isNew: product.isNew || false,
                isFeatured: product.isFeatured || false,
                hasDiscount: product.hasDiscount || false,
                discount: product.discount || '',
                reinforcement: product.reinforcement || false,
                reflective: product.reflective || false,
                thermal: product.thermal || false,
                embroidery: product.embroidery || {
                    included: false,
                    maxStitches: 15000,
                    colors: 6,
                    positions: ['Pecho izquierdo']
                },
                features: product.features || []
            })
        }
    }, [product])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleNumberChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? '' : Number(value)
        }))
    }

    const handleEmbroideryChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            embroidery: {
                ...prev.embroidery,
                [field]: value
            }
        }))
    }

    const toggleSize = (size) => {
        setFormData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }))
    }

    const addColor = () => {
        if (colorInput && !formData.colors.includes(colorInput)) {
            setFormData(prev => ({
                ...prev,
                colors: [...prev.colors, colorInput]
            }))
            setColorInput('')
        }
    }

    const removeColor = (color) => {
        setFormData(prev => ({
            ...prev,
            colors: prev.colors.filter(c => c !== color)
        }))
    }

    const addImage = () => {
        if (imageInput && !formData.images.includes(imageInput)) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, imageInput]
            }))
            setImageInput('')
        }
    }

    const removeImage = (image) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter(i => i !== image)
        }))
    }

    const addFeature = () => {
        if (featureInput && !formData.features.includes(featureInput)) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, featureInput]
            }))
            setFeatureInput('')
        }
    }

    const removeFeature = (feature) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter(f => f !== feature)
        }))
    }

    const toggleEmbroideryPosition = (position) => {
        setFormData(prev => ({
            ...prev,
            embroidery: {
                ...prev.embroidery,
                positions: prev.embroidery.positions.includes(position)
                    ? prev.embroidery.positions.filter(p => p !== position)
                    : [...prev.embroidery.positions, position]
            }
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Preparar datos para enviar
            const updateData = {
                name: formData.name,
                description: formData.description,
                reference: formData.reference,
                price: Number(formData.price),
                comparePrice: formData.comparePrice ? Number(formData.comparePrice) : null,
                productType: formData.productType,
                categoryId: formData.categoryId,
                subcategory: formData.subcategory || null,
                sizes: formData.sizes,
                colors: formData.colors,
                material: formData.material || null,
                weight: formData.weight || null,
                stock: Number(formData.stock),
                minOrder: Number(formData.minOrder),
                imageUrl: formData.imageUrl || null,
                images: formData.images,
                isActive: formData.isActive,
                isNew: formData.isNew,
                isFeatured: formData.isFeatured,
                hasDiscount: formData.hasDiscount,
                discount: formData.discount ? Number(formData.discount) : 0,
                reinforcement: formData.reinforcement,
                reflective: formData.reflective,
                thermal: formData.thermal,
                embroidery: formData.embroidery.included ? {
                    included: true,
                    maxStitches: Number(formData.embroidery.maxStitches),
                    colors: Number(formData.embroidery.colors),
                    positions: formData.embroidery.positions
                } : null,
                features: formData.features.length > 0 ? formData.features : null
            }

            await api.products.update(product.id, updateData)
            onSave()
            onClose()
        } catch (error) {
            console.error('Error updating product:', error)
            alert('Error al actualizar el producto: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-primary">Editar Producto</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <Icon name="close" className="text-2xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Información Básica */}
                    <div className="border-b pb-4">
                        <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <Icon name="info" />
                            Información Básica
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nombre del Producto *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Referencia *</label>
                                <input
                                    type="text"
                                    name="reference"
                                    value={formData.reference}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Descripción</label>
                                <textarea
                                    name="description"
                                    rows="3"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Precios */}
                    <div className="border-b pb-4">
                        <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <Icon name="attach_money" />
                            Precios
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Precio * (CLP)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleNumberChange}
                                    required
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Precio Comparación</label>
                                <input
                                    type="number"
                                    name="comparePrice"
                                    value={formData.comparePrice}
                                    onChange={handleNumberChange}
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-4 pt-6">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="hasDiscount"
                                        checked={formData.hasDiscount}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-primary rounded"
                                    />
                                    <span className="text-sm">¿En oferta?</span>
                                </label>
                                {formData.hasDiscount && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold">Descuento:</span>
                                        <input
                                            type="number"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleNumberChange}
                                            className="w-20 border border-gray-300 p-2 rounded text-center"
                                        />
                                        <span className="text-sm">%</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Clasificación */}
                    <div className="border-b pb-4">
                        <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <Icon name="category" />
                            Clasificación
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Producto</label>
                                <select
                                    name="productType"
                                    value={formData.productType}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                >
                                    {availableProductTypes.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Categoría</label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                >
                                    <option value="">Seleccionar categoría</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Subcategoría</label>
                                <input
                                    type="text"
                                    name="subcategory"
                                    value={formData.subcategory}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tallas */}
                    <div className="border-b pb-4">
                        <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <Icon name="straighten" />
                            Tallas Disponibles
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {availableSizes.map(size => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => toggleSize(size)}
                                    className={`px-4 py-2 rounded-lg border font-bold transition-colors ${formData.sizes.includes(size)
                                        ? 'bg-primary text-white border-primary'
                                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Colores */}
                    <div className="border-b pb-4">
                        <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <Icon name="palette" />
                            Colores
                        </h4>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={colorInput}
                                onChange={(e) => setColorInput(e.target.value)}
                                placeholder="Nombre del color o código hex (#FFFFFF)"
                                className="flex-1 border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                            />
                            <button
                                type="button"
                                onClick={addColor}
                                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
                            >
                                Agregar
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.colors.map(color => (
                                <div
                                    key={color}
                                    className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
                                >
                                    <div
                                        className="w-4 h-4 rounded-full border border-gray-300"
                                        style={{ backgroundColor: color.toLowerCase() }}
                                    />
                                    <span className="text-sm">{color}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeColor(color)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Icon name="close" className="text-sm" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Inventario */}
                    <div className="border-b pb-4">
                        <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <Icon name="inventory" />
                            Inventario
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleNumberChange}
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Pedido Mínimo</label>
                                <input
                                    type="number"
                                    name="minOrder"
                                    value={formData.minOrder}
                                    onChange={handleNumberChange}
                                    className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Imágenes */}
                    <div className="border-b pb-4">
                        <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <Icon name="image" />
                            Imágenes
                        </h4>
                        <div className="mb-3">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Imagen Principal (URL)</label>
                            <input
                                type="text"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={imageInput}
                                onChange={(e) => setImageInput(e.target.value)}
                                placeholder="URL de imagen adicional"
                                className="flex-1 border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary outline-none"
                            />
                            <button
                                type="button"
                                onClick={addImage}
                                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
                            >
                                Agregar
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.images.map((img, idx) => (
                                <div key={idx} className="relative group">
                                    <img src={img} alt="" className="w-16 h-16 object-cover rounded border" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(img)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <Icon name="close" className="text-xs" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Características Técnicas */}
                    <div className="border-b pb-4">
                        <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <Icon name="construction" />
                            Características Técnicas
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Material</label>
                                <input
                                    type="text"
                                    name="material"
                                    value={formData.material}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Peso</label>
                                <input
                                    type="text"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    placeholder="Ej: 210 gr/m²"
                                    className="w-full border border-gray-300 p-2 rounded"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="reinforcement" checked={formData.reinforcement} onChange={handleChange} />
                                <span className="text-sm">Reforzado</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="reflective" checked={formData.reflective} onChange={handleChange} />
                                <span className="text-sm">Reflectante</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="thermal" checked={formData.thermal} onChange={handleChange} />
                                <span className="text-sm">Térmico</span>
                            </label>
                        </div>
                    </div>

                    {/* Características destacadas */}
                    <div className="border-b pb-4">
                        <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <Icon name="stars" />
                            Características Destacadas
                        </h4>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={featureInput}
                                onChange={(e) => setFeatureInput(e.target.value)}
                                placeholder="Nueva característica"
                                className="flex-1 border border-gray-300 p-2 rounded"
                            />
                            <button
                                type="button"
                                onClick={addFeature}
                                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
                            >
                                Agregar
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {formData.features.map((feature, idx) => (
                                <div key={idx} className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-2">
                                    <span className="text-sm">{feature}</span>
                                    <button type="button" onClick={() => removeFeature(feature)} className="text-red-500">
                                        <Icon name="close" className="text-sm" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bordado */}
                    <div className="border-b pb-4">
                        <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <Icon name="brush" />
                            Configuración de Bordado
                        </h4>
                        <label className="flex items-center gap-2 mb-4">
                            <input
                                type="checkbox"
                                checked={formData.embroidery.included}
                                onChange={(e) => handleEmbroideryChange('included', e.target.checked)}
                            />
                            <span className="text-sm font-bold">¿El producto incluye bordado?</span>
                        </label>

                        {formData.embroidery.included && (
                            <div className="space-y-4 pl-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Puntadas máximas</label>
                                        <input
                                            type="number"
                                            value={formData.embroidery.maxStitches}
                                            onChange={(e) => handleEmbroideryChange('maxStitches', parseInt(e.target.value))}
                                            className="w-full border border-gray-300 p-2 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Número de colores</label>
                                        <input
                                            type="number"
                                            value={formData.embroidery.colors}
                                            onChange={(e) => handleEmbroideryChange('colors', parseInt(e.target.value))}
                                            className="w-full border border-gray-300 p-2 rounded"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Posiciones disponibles</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {embroideryPositions.map(pos => (
                                            <label key={pos} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.embroidery.positions.includes(pos)}
                                                    onChange={() => toggleEmbroideryPosition(pos)}
                                                />
                                                <span className="text-sm">{pos}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Estado */}
                    <div className="border-b pb-4">
                        <h4 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <Icon name="toggle_on" />
                            Estado
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                                <span className="text-sm">Producto Activo</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="isNew" checked={formData.isNew} onChange={handleChange} />
                                <span className="text-sm">Producto Nuevo</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
                                <span className="text-sm">Producto Destacado</span>
                            </label>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded font-bold hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-[#FC9430] text-white rounded font-bold hover:bg-[#e0852b] disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}