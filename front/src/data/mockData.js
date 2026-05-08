// Importar desde los nuevos archivos
import {
    allProducts,
    getFeaturedProducts,
    getProductById,
    getProductsByCategory,
    catalogo
} from './catalogo/index'

// Re-exportar para mantener compatibilidad
export const products = allProducts
export const featuredProducts = getFeaturedProducts()
export const getProductById_old = getProductById
export const getProductsByCategory_old = getProductsByCategory

// Categorías para el sidebar
export const categories = [
    { id: 'corporativo', name: 'Corporativo', slug: 'corporativo', icon: 'work', count: catalogo.corporativo.length },
    { id: 'industrial', name: 'Industrial', slug: 'industrial', icon: 'construction', count: catalogo.industrial.length },
    { id: 'bordados', name: 'Bordados', slug: 'bordados', icon: 'brush', count: catalogo.bordados.length },
    { id: 'equipos', name: 'Equipos Trabajo', slug: 'equipos', icon: 'groups', count: catalogo.equipos.length }
]

// Órdenes de ejemplo
export const orders = [
    {
        id: 'ELD-10254',
        date: '2025-05-15',
        total: 248000,
        status: 'in_transit',
        items: [
            { product: catalogo.corporativo[0], quantity: 10, subtotal: 129000 },
            { product: catalogo.industrial[3], quantity: 5, subtotal: 114500 }
        ],
        shipping: {
            carrier: 'Chilexpress',
            tracking: '987654321',
            estimatedDelivery: '2025-05-24'
        }
    }
]

export default {
    products: allProducts,
    featuredProducts,
    categories,
    orders
}