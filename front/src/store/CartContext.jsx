// src/store/CartContext.jsx
import { createContext, useState, useEffect } from 'react'

export const CartContext = createContext()

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart')
        const parsed = saved ? JSON.parse(saved) : []
        // Asegurar que los precios cargados sean números
        const normalized = parsed.map(item => ({
            ...item,
            price: typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0,
            quantity: typeof item.quantity === 'number' ? item.quantity : 1
        }))
        console.log('🛒 [CartContext] Cargando carrito desde localStorage:', normalized)
        return normalized
    })

    useEffect(() => {
        console.log('🛒 [CartContext] Guardando carrito en localStorage:', cart)
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    // Agregar al carrito con datos de bordado
    const addToCart = (product, quantity = 1) => {
        console.log('🛒 [CartContext] addToCart llamado con:', { product, quantity })
        console.log('🛒 [CartContext] product.embroidery:', product.embroidery)

        // ✅ Convertir precio a número
        const priceNumber = typeof product.price === 'number'
            ? product.price
            : parseFloat(product.price) || 0

        // ✅ Asegurar que quantity sea número
        const finalQuantity = typeof quantity === 'number' ? quantity : 1

        setCart(prev => {
            const existingIndex = prev.findIndex(item => item.id === product.id)

            if (existingIndex !== -1) {
                console.log('🛒 [CartContext] Producto ya existe, actualizando...')
                const updated = [...prev]
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: finalQuantity,
                    embroidery: product.embroidery || updated[existingIndex].embroidery,
                    price: priceNumber,
                    selectedColor: product.selectedColor || updated[existingIndex].selectedColor,
                    selectedSize: product.selectedSize || updated[existingIndex].selectedSize
                }
                console.log('🛒 [CartContext] Producto actualizado:', updated[existingIndex])
                return updated
            }

            const newProduct = {
                id: product.id,
                name: product.name,
                reference: product.reference,
                price: priceNumber,
                image: product.image,
                minOrder: product.minOrder || 10,
                selectedColor: product.selectedColor || null,
                selectedSize: product.selectedSize || null,
                embroidery: product.embroidery || null,
                quantity: finalQuantity
            }

            console.log('🛒 [CartContext] Nuevo producto agregado:', newProduct)
            console.log('🛒 [CartContext] embroidery en nuevo producto:', newProduct.embroidery)

            return [...prev, newProduct]
        })
    }

    // Actualizar solo el bordado de un producto
    const updateEmbroidery = (productId, embroideryData) => {
        console.log('🛒 [CartContext] updateEmbroidery llamado:', { productId, embroideryData })
        setCart(prev => prev.map(item =>
            item.id === productId
                ? { ...item, embroidery: embroideryData }
                : item
        ))
    }

    const removeFromCart = (productId) => {
        console.log('🛒 [CartContext] removeFromCart:', productId)
        setCart(prev => prev.filter(item => item.id !== productId))
    }

    const updateQuantity = (productId, quantity) => {
        console.log('🛒 [CartContext] updateQuantity:', { productId, quantity })
        const finalQuantity = typeof quantity === 'number' ? quantity : 1
        if (finalQuantity <= 0) {
            removeFromCart(productId)
            return
        }
        setCart(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity: finalQuantity } : item
        ))
    }

    const clearCart = () => {
        console.log('🛒 [CartContext] clearCart llamado')
        setCart([])
    }

    const getTotalItems = () => cart.reduce((sum, item) => {
        const qty = typeof item.quantity === 'number' ? item.quantity : 1
        return sum + qty
    }, 0)

    // ✅ getTotalPrice corregido
    const getTotalPrice = () => cart.reduce((sum, item) => {
        const price = typeof item.price === 'number' ? item.price : parseFloat(item.price) || 0
        const quantity = typeof item.quantity === 'number' ? item.quantity : 1
        const subtotal = price * quantity
        console.log(`💰 [CartContext] ${item.name}: precio=${price}, cantidad=${quantity}, subtotal=${subtotal}`)
        return sum + subtotal
    }, 0)

    // Log del estado actual del carrito cada vez que cambia
    useEffect(() => {
        console.log('🛒 [CartContext] Estado actual del carrito:', cart)
        console.log('🛒 [CartContext] Items con embroidery:', cart.filter(item => item.embroidery))
        console.log('🛒 [CartContext] Precio total:', getTotalPrice())
    }, [cart])

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            updateEmbroidery,
            removeFromCart,
            updateQuantity,
            clearCart,
            getTotalItems,
            getTotalPrice
        }}>
            {children}
        </CartContext.Provider>
    )
}