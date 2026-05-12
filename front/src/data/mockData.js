// Importar desde los nuevos archivos
import {
    allProducts as allProductsData,
    featuredProducts as featuredProductsData,
    getProductById as getProductByIdFn,
    getProductsByCategory as getProductsByCategoryFn,
    categories as categoriesData,
    catalogo
} from './catalogo/index'

// Exportar para uso en la aplicación
export const allProducts = allProductsData
export const products = allProductsData  // ← Añadir esta línea para compatibilidad
export const featuredProducts = featuredProductsData.slice(0, 4)
export const getProductById = getProductByIdFn
export const getProductsByCategory = getProductsByCategoryFn
export const categories = categoriesData
export const catalogData = catalogo

// Productos destacados para la página de inicio (primeros 4)
export const featuredProductsHome = allProductsData.filter(p => p.isFeatured).slice(0, 4)

// Órdenes de ejemplo
export const orders = [
    {
        id: 'ELD-10254',
        date: '2025-05-15',
        total: 248000,
        status: 'in_transit',
        items: [
            {
                product: catalogo.corporativo?.[0],
                quantity: 10,
                subtotal: catalogo.corporativo?.[0]?.price * 10 || 0
            },
            {
                product: catalogo.industrial?.[3],
                quantity: 5,
                subtotal: catalogo.industrial?.[3]?.price * 5 || 0
            }
        ],
        shipping: {
            carrier: 'Chilexpress',
            tracking: '987654321',
            estimatedDelivery: '2025-05-24'
        }
    }
]

// Exportación por defecto
export default {
    products: allProductsData,
    featuredProducts: featuredProductsData,
    categories: categoriesData,
    orders,
    catalogo
}