// src/store/CartContext.jsx
import { createContext, useState, useEffect } from 'react'

export const CartContext = createContext()

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart')
        const parsed = saved ? JSON.parse(saved) : []
        console.log('🛒 [CartContext] Cargando carrito desde localStorage:', parsed)
        return parsed
    })

    useEffect(() => {
        console.log('🛒 [CartContext] Guardando carrito en localStorage:', cart)
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    // Agregar al carrito con datos de bordado
    const addToCart = (product, quantity = 1) => {
        console.log('🛒 [CartContext] addToCart llamado con:', { product, quantity })
        console.log('🛒 [CartContext] product.embroidery:', product.embroidery)

        setCart(prev => {
            const existingIndex = prev.findIndex(item => item.id === product.id)

            if (existingIndex !== -1) {
                console.log('🛒 [CartContext] Producto ya existe, actualizando...')
                const updated = [...prev]
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity,
                    embroidery: product.embroidery || updated[existingIndex].embroidery
                }
                console.log('🛒 [CartContext] Producto actualizado:', updated[existingIndex])
                return updated
            }

            const newProduct = {
                id: product.id,
                name: product.name,
                reference: product.reference,
                price: product.price,
                image: product.image,
                minOrder: product.minOrder,
                selectedColor: product.selectedColor,
                selectedSize: product.selectedSize,
                embroidery: product.embroidery || null
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
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }
        setCart(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity } : item
        ))
    }

    const clearCart = () => {
        console.log('🛒 [CartContext] clearCart llamado')
        setCart([])
    }

    const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0)

    const getTotalPrice = () => cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0)

    // Log del estado actual del carrito cada vez que cambia
    useEffect(() => {
        console.log('🛒 [CartContext] Estado actual del carrito:', cart)
        console.log('🛒 [CartContext] Items con embroidery:', cart.filter(item => item.embroidery))
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