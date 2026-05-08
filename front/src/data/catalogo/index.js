import corporativoProducts from './corporativo'
import industrialProducts from './industrial'
import bordadosProducts from './bordados'
import equiposProducts from './equipos'

export const catalogo = {
    corporativo: corporativoProducts,
    industrial: industrialProducts,
    bordados: bordadosProducts,
    equipos: equiposProducts
}

export const allProducts = [
    ...corporativoProducts,
    ...industrialProducts,
    ...bordadosProducts,
    ...equiposProducts
]

// Función para obtener productos por categoría
export const getProductsByCategory = (category) => {
    switch (category) {
        case 'corporativo':
            return corporativoProducts
        case 'industrial':
            return industrialProducts
        case 'bordados':
            return bordadosProducts
        case 'equipos':
            return equiposProducts
        default:
            return allProducts
    }
}

// Función para obtener un producto por ID
export const getProductById = (id) => {
    return allProducts.find(product => product.id === id)
}

// Función para obtener productos destacados
export const getFeaturedProducts = () => {
    return allProducts.filter(product => product.isFeatured).slice(0, 4)
}

// Función para obtener productos nuevos
export const getNewProducts = () => {
    return allProducts.filter(product => product.isNew)
}

// Función para obtener productos en oferta
export const getDiscountedProducts = () => {
    return allProducts.filter(product => product.hasDiscount)
}

export default catalogo