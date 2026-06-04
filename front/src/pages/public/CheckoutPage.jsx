// src/pages/public/CheckoutPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../../components/ui/Icon'
import api from '../../config/api'

export default function CheckoutPage() {
    const { cart, getTotalPrice, clearCart } = useCart()
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: 'La Serena',
        region: 'Coquimbo',
        notes: ''
    })

    // ========== LOG: Estado inicial del carrito ==========
    console.log('========== CHECKOUT PAGE LOADED ==========')
    console.log('📦 Carrito completo:', cart)
    console.log('📦 Items con bordado:', cart.filter(item => item.embroidery))
    console.log('👤 Usuario autenticado:', user?.id, user?.email)
    console.log('===========================================')

    useEffect(() => {
        if (user) {
            console.log('📝 Cargando datos del usuario al formulario:', user)
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                company: user.company || ''
            }))
        }
    }, [user])

    useEffect(() => {
        if (!isAuthenticated) {
            console.log('🔒 Usuario no autenticado, redirigiendo a login...')
            navigate('/login', { state: { from: '/checkout' } })
        }
    }, [isAuthenticated, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // Función mejorada para convertir dataURL a File con más logs
    const dataURLtoFile = (dataURL, filename) => {
        console.log('🔄 [dataURLtoFile] Iniciando conversión...')
        console.log('🔄 [dataURLtoFile] filename:', filename)
        console.log('🔄 [dataURLtoFile] dataURL length:', dataURL?.length || 0)
        console.log('🔄 [dataURLtoFile] dataURL preview:', dataURL?.substring(0, 100))

        try {
            const arr = dataURL.split(',')
            console.log('🔄 [dataURLtoFile] split result length:', arr.length)

            const mimeMatch = arr[0].match(/:(.*?);/)
            if (!mimeMatch) {
                throw new Error('No se pudo detectar el tipo MIME')
            }
            const mime = mimeMatch[1]
            console.log('🔄 [dataURLtoFile] MIME type detectado:', mime)

            const bstr = atob(arr[1])
            console.log('🔄 [dataURLtoFile] Bytes decodificados:', bstr.length)

            let n = bstr.length
            const u8arr = new Uint8Array(n)
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n)
            }

            const file = new File([u8arr], filename, { type: mime })
            console.log('✅ [dataURLtoFile] Archivo creado exitosamente:', {
                name: file.name,
                size: file.size,
                type: file.type
            })
            return file
        } catch (error) {
            console.error('❌ [dataURLtoFile] Error en conversión:', error)
            throw error
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        console.log('\n========== INICIANDO CHECKOUT ==========')
        console.log('📦 Estado del carrito al checkout:', cart)
        console.log('📦 Cantidad de items:', cart.length)

        if (cart.length === 0) {
            console.log('❌ Carrito vacío')
            setError('No hay productos en el carrito')
            return
        }

        setLoading(true)
        setError(null)

        try {
            // ========== PASO 1: Crear la orden ==========
            console.log('\n📝 [PASO 1] Creando orden...')
            const orderData = {
                userId: user.id,
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity
                }))
            }
            console.log('📝 orderData:', JSON.stringify(orderData, null, 2))

            const order = await api.orders.create(orderData)
            console.log('✅ Orden creada exitosamente:', order)
            console.log('✅ Order ID:', order.id)

            // ========== PASO 2: Verificar items con bordado ==========
            console.log('\n🎨 [PASO 2] Verificando items con bordado...')
            const embroideryItems = cart.filter(item => {
                const hasEmbroidery = item.embroidery && Object.keys(item.embroidery).length > 0
                console.log(`  - Item ${item.id} (${item.name}): tiene bordado? ${hasEmbroidery}`)
                if (hasEmbroidery) {
                    console.log(`    Datos de bordado:`, {
                        positions: item.embroidery.positions,
                        colors: item.embroidery.colors,
                        maxStitches: item.embroidery.maxStitches,
                        hasLogoData: !!item.embroidery.logoData,
                        logoFilename: item.embroidery.logoFilename,
                        hasSpecialInstructions: !!item.embroidery.specialInstructions
                    })
                }
                return hasEmbroidery
            })

            console.log(`\n📊 Total items con bordado: ${embroideryItems.length}`)

            if (embroideryItems.length > 0) {
                console.log('\n🎨 [PASO 3] Procesando solicitudes de bordado...')

                const embroideryPromises = embroideryItems.map(async (item, index) => {
                    console.log(`\n--- Procesando bordado ${index + 1}/${embroideryItems.length} ---`)
                    console.log(`Producto ID: ${item.id}`)
                    console.log(`Producto nombre: ${item.name}`)
                    console.log(`Producto referencia: ${item.reference}`)

                    // Verificar que exista logoData
                    if (!item.embroidery.logoData) {
                        console.error(`❌ ERROR CRÍTICO: No hay logoData para el producto ${item.id}`)
                        throw new Error(`No se encontró el archivo del logo para el producto ${item.name}`)
                    }

                    console.log(`📄 LogoData presente, tamaño: ${item.embroidery.logoData.length} caracteres`)

                    // Convertir dataURL a File
                    let fileBlob
                    try {
                        fileBlob = dataURLtoFile(
                            item.embroidery.logoData,
                            item.embroidery.logoFilename || `logo_${item.id}.png`
                        )
                    } catch (fileError) {
                        console.error(`❌ Error al convertir logoData a File:`, fileError)
                        throw new Error(`Error al procesar el archivo del logo para ${item.name}: ${fileError.message}`)
                    }

                    // Crear FormData
                    const formData = new FormData()
                    formData.append('productId', item.id)
                    formData.append('productName', item.name)
                    formData.append('productReference', item.reference)
                    formData.append('maxStitches', item.embroidery.maxStitches?.toString() || '15000')
                    formData.append('colors', item.embroidery.colors?.toString() || '6')
                    formData.append('positions', JSON.stringify(item.embroidery.positions || ['Pecho izquierdo']))
                    formData.append('orderId', order.id)

                    if (item.embroidery.specialInstructions) {
                        formData.append('specialInstructions', item.embroidery.specialInstructions)
                        console.log(`📝 Instrucciones especiales: ${item.embroidery.specialInstructions.substring(0, 100)}...`)
                    }

                    formData.append('file', fileBlob, item.embroidery.logoFilename || `logo_${item.id}.png`)

                    // Log de lo que se envía (no podemos loguear FormData directamente, pero podemos ver sus entries)
                    console.log('📤 Enviando solicitud de bordado con:')
                    for (let pair of formData.entries()) {
                        if (pair[0] === 'file') {
                            console.log(`  - ${pair[0]}: ${pair[1]?.name} (${pair[1]?.size} bytes, ${pair[1]?.type})`)
                        } else {
                            console.log(`  - ${pair[0]}: ${pair[1]}`)
                        }
                    }

                    try {
                        const response = await api.embroidery.createRequest(formData)
                        console.log(`✅ Solicitud de bordado creada exitosamente para ${item.name}:`, response)
                        return response
                    } catch (embroideryError) {
                        console.error(`❌ Error al crear solicitud de bordado para ${item.name}:`, embroideryError)
                        console.error('Detalles del error:', embroideryError.response?.data || embroideryError.message)
                        throw new Error(`Error al guardar el bordado para ${item.name}: ${embroideryError.response?.data?.message || embroideryError.message}`)
                    }
                })

                console.log('\n⏳ Esperando que todas las solicitudes de bordado se completen...')
                await Promise.all(embroideryPromises)
                console.log('✅ Todas las solicitudes de bordado completadas exitosamente')
            } else {
                console.log('⚠️ No hay items con bordado, omitiendo creación de solicitudes')
            }

            // ========== PASO 4: Limpiar carrito y redirigir ==========
            console.log('\n🧹 [PASO 4] Limpiando carrito...')
            clearCart()
            console.log('✅ Carrito limpiado')

            setSuccess(true)
            console.log('\n🎉 CHECKOUT COMPLETADO EXITOSAMENTE 🎉')
            console.log(`Order ID: ${order.id}`)
            console.log(`Items procesados: ${cart.length}`)
            console.log(`Items con bordado: ${embroideryItems.length}`)
            console.log('=========================================\n')

            setTimeout(() => {
                navigate('/confirmacion', { state: { orderId: order.id } })
            }, 2000)

        } catch (err) {
            console.error('\n❌❌❌ ERROR EN CHECKOUT ❌❌❌')
            console.error('Error completo:', err)
            console.error('Mensaje:', err.message)
            console.error('Stack:', err.stack)
            if (err.response) {
                console.error('Response data:', err.response.data)
                console.error('Response status:', err.response.status)
            }
            setError(err.message || 'Error al procesar tu pedido. Por favor, intenta nuevamente.')
        } finally {
            setLoading(false)
        }
    }

    const subtotal = getTotalPrice()
    const shippingCost = 4500
    const total = subtotal + shippingCost
    const embroideryCount = cart.filter(item => item.embroidery && Object.keys(item.embroidery).length > 0).length

    console.log('📊 [RENDER] Resumen del carrito:')
    console.log(`  - Subtotal: $${subtotal}`)
    console.log(`  - Items con bordado: ${embroideryCount}`)

    if (success) {
        return (
            <div className="max-w-[1280px] mx-auto px-8 py-20 text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon name="check_circle" className="text-5xl text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-primary mb-4">¡Pedido Procesado!</h2>
                <p className="text-gray-600 mb-8">Tu pedido ha sido procesado correctamente. Redirigiendo a la confirmación...</p>
                <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto overflow-hidden">
                    <div className="w-full h-full bg-[#FC9430] animate-pulse"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-[1280px] mx-auto px-8 py-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Finalizar Compra</h1>
            <p className="text-on-surface-variant mb-8">Completa tus datos para procesar el pedido</p>

            {embroideryCount > 0 && (
                <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <div className="flex items-center gap-3">
                        <Icon name="brush" className="text-blue-500" />
                        <div>
                            <p className="text-sm font-bold text-blue-700">Bordado Personalizado</p>
                            <p className="text-xs text-blue-600">
                                Tu pedido incluye {embroideryCount} producto(s) con bordado personalizado.
                                Los archivos de logo serán procesados al confirmar la compra.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex items-center gap-3">
                        <Icon name="error" className="text-red-500" />
                        <div>
                            <p className="text-sm text-red-700 font-bold">Error al procesar el pedido</p>
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white border border-outline-variant rounded-lg p-6">
                            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                <Icon name="person" />
                                Información de Contacto
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Nombre Completo *</label>
                                    <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Email *</label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Teléfono / WhatsApp *</label>
                                    <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Empresa</label>
                                    <input type="text" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-outline-variant rounded-lg p-6">
                            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                <Icon name="local_shipping" />
                                Dirección de Envío
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Dirección *</label>
                                    <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Ciudad *</label>
                                        <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Región *</label>
                                        <select name="region" required value={formData.region} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition">
                                            <option value="Coquimbo">Coquimbo</option>
                                            <option value="Valparaíso">Valparaíso</option>
                                            <option value="Metropolitana">Metropolitana</option>
                                            <option value="O'Higgins">O'Higgins</option>
                                            <option value="Maule">Maule</option>
                                            <option value="Ñuble">Ñuble</option>
                                            <option value="Biobío">Biobío</option>
                                            <option value="Araucanía">Araucanía</option>
                                            <option value="Los Ríos">Los Ríos</option>
                                            <option value="Los Lagos">Los Lagos</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-outline-variant rounded-lg p-6">
                            <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                                <Icon name="note" />
                                Notas Adicionales
                            </h2>
                            <textarea name="notes" rows="3" value={formData.notes} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition resize-none" placeholder="Instrucciones especiales para el envío o detalles adicionales..." />
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-[#FC9430] text-white py-4 font-bold uppercase tracking-wider rounded-lg hover:bg-[#e0852b] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Procesando Pedido...
                                </>
                            ) : (
                                <>
                                    <Icon name="check_circle" />
                                    Confirmar Compra
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-5">
                    <div className="bg-surface-container-low border border-outline-variant rounded-lg p-6 sticky top-32">
                        <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                            <Icon name="shopping_bag" />
                            Resumen del Pedido
                        </h3>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-4">
                            {cart.map(item => (
                                <div key={item.id} className="flex gap-3 pb-3 border-b border-outline-variant last:border-0">
                                    <div className="w-16 h-16 bg-white border border-outline-variant rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.image || 'https://via.placeholder.com/64'} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-primary text-sm uppercase truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                                        {item.selectedSize && <p className="text-xs text-gray-500">Talla: {item.selectedSize}</p>}
                                        {item.embroidery && (
                                            <p className="text-xs text-[#FC9430] flex items-center gap-1 mt-1">
                                                <Icon name="brush" className="text-xs" />
                                                Con bordado
                                            </p>
                                        )}
                                        <p className="text-sm font-bold text-[#FC9430] mt-1">${(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-outline-variant pt-4 space-y-2">
                            <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal</span><span className="font-bold">${subtotal.toLocaleString()}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-600">Envío</span><span className="font-bold">${shippingCost.toLocaleString()}</span></div>
                            {embroideryCount > 0 && <div className="flex justify-between text-sm text-green-600"><span>Bordado de logo</span><span>Incluido</span></div>}
                            <div className="flex justify-between text-lg font-bold pt-3 border-t border-outline-variant"><span className="text-primary">Total</span><span className="text-[#FC9430]">${total.toLocaleString()}</span></div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-outline-variant text-center">
                            <p className="text-xs text-gray-500 flex items-center justify-center gap-1"><Icon name="schedule" className="text-sm" />Tiempo estimado de entrega: 5-7 días hábiles</p>
                            <p className="text-xs text-gray-400 mt-2">* Los productos con bordado pueden requerir 2-3 días adicionales</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}