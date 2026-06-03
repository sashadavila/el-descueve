// src/store/CartContext.jsx
import { createContext, useState, useEffect } from 'react'

export const CartContext = createContext()

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart')
        return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    // Agregar al carrito con datos de bordado
    const addToCart = (product, quantity = 1, embroideryData = null) => {
        setCart(prev => {
            const existingIndex = prev.findIndex(item => item.id === product.id)

            if (existingIndex !== -1) {
                const updated = [...prev]
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity,
                    embroidery: embroideryData || updated[existingIndex].embroidery
                }
                return updated
            }
            return [...prev, {
                ...product,
                quantity,
                embroidery: embroideryData
            }]
        })
    }

    // Actualizar solo el bordado de un producto
    const updateEmbroidery = (productId, embroideryData) => {
        setCart(prev => prev.map(item =>
            item.id === productId
                ? { ...item, embroidery: embroideryData }
                : item
        ))
    }

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId))
    }

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId)
            return
        }
        setCart(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity } : item
        ))
    }

    const clearCart = () => setCart([])

    const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0)

    const getTotalPrice = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

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