import corporativoProducts from './corporativo'
import industrialProducts from './industrial'
import bordadosProducts from './bordados'
import equiposProducts from './equipos'

// Asegurar que cada producto tenga un id único y consistente
const ensureProductId = (products) => {
    return products.map(p => ({
        ...p,
        id: p.id || `${p.category}-${p.reference}`
    }))
}

export const catalogo = {
    corporativo: ensureProductId(corporativoProducts),
    industrial: ensureProductId(industrialProducts),
    bordados: ensureProductId(bordadosProducts),
    equipos: ensureProductId(equiposProducts)
}

// Todos los productos combinados
export const allProducts = [
    ...catalogo.corporativo,
    ...catalogo.industrial,
    ...catalogo.bordados,
    ...catalogo.equipos
]

// Productos destacados
export const featuredProducts = allProducts.filter(product => product.isFeatured)

// Función para obtener productos por categoría
export const getProductsByCategory = (category) => {
    switch (category) {
        case 'corporativo':
            return catalogo.corporativo
        case 'industrial':
            return catalogo.industrial
        case 'bordados':
            return catalogo.bordados
        case 'equipos':
            return catalogo.equipos
        default:
            return allProducts
    }
}

// Función para obtener un producto por ID
export const getProductById = (id) => {
    return allProducts.find(product => product.id === id)
}

// Función para obtener productos destacados (alias)
export const getFeaturedProducts = () => {
    return allProducts.filter(product => product.isFeatured)
}

// Función para obtener productos nuevos
export const getNewProducts = () => {
    return allProducts.filter(product => product.isNew)
}

// Función para obtener productos en oferta
export const getDiscountedProducts = () => {
    return allProducts.filter(product => product.hasDiscount)
}

// Categorías para el sidebar
export const categories = [
    { id: 'corporativo', name: 'Corporativo', slug: 'corporativo', icon: 'work', count: catalogo.corporativo.length },
    { id: 'industrial', name: 'Industrial', slug: 'industrial', icon: 'construction', count: catalogo.industrial.length },
    { id: 'bordados', name: 'Bordados', slug: 'bordados', icon: 'brush', count: catalogo.bordados.length },
    { id: 'equipos', name: 'Equipos Trabajo', slug: 'equipos', icon: 'groups', count: catalogo.equipos.length }
]

export default catalogo