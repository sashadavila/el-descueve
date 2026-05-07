export const products = [
    {
        id: 1,
        name: 'Polera Polo Piqué',
        reference: 'POL-001',
        price: 12900,
        category: 'Corporativo',
        image: 'https://comerciallamas.cl/wp-content/uploads/2023/04/polera-polo-mc-hombre-60-alg-40-poly-18.jpg',
        description: 'Polera polo en algodón piqué, ideal para imagen corporativa. Incluye bordado de logo en el pecho.',
        material: '100% Algodón Piqué - 210 gr/m²',
        colors: ['#163C7A', '#B91C1C', '#111827', '#FFFFFF'],
        sizes: ['S', 'M', 'L', 'XL', '2XL'],
        minOrder: 10,
        inStock: true
    },
    {
        id: 2,
        name: 'Micropolar Térmico',
        reference: 'MIC-045',
        price: 22900,
        category: 'Térmica',
        image: 'https://uniformessami.cl/cdn/shop/files/micropolar-termico-ml-mujer-100-poly_3.jpg',
        description: 'Abrigo ligero, ideal para oficina y terreno. Bordado de logo incluido.',
        material: 'Polar 280 gr',
        colors: ['#4B5563', '#1F2937', '#0F172A'],
        sizes: ['S', 'M', 'L', 'XL', '2XL'],
        minOrder: 10,
        inStock: true
    },
    {
        id: 3,
        name: 'Pantalón Cargo Industrial',
        reference: 'CAR-012',
        price: 28900,
        category: 'Industrial',
        image: 'https://tworldstore.cl/6139-superlarge_default/pantalon-cargo-gabardina-forro-polar-hombre.jpg',
        description: 'Múltiples bolsillos, tela resistente para terreno y operación diaria.',
        material: 'Gabardina reforzada',
        colors: ['#4A5D23', '#2C2C2C', '#8B7355'],
        sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
        minOrder: 10,
        inStock: true
    },
    {
        id: 4,
        name: 'Chaleco Geólogo',
        reference: 'GEO-001',
        price: 32900,
        category: 'Industrial',
        image: 'https://www.apro.cl/cdn/shop/files/CHALECOEXOSETGEOLOGONARANJO-AZUL.jpg',
        description: 'Duradero, reflectante, ideal para minería, construcción y terreno.',
        material: 'Oxford resistente',
        colors: ['#EA580C', '#1E3A8A', '#15803D'],
        sizes: ['S', 'M', 'L', 'XL', '2XL'],
        minOrder: 10,
        inStock: true
    }
]

export const featuredProducts = products.slice(0, 4)

export const categories = [
    { name: 'Corporativo', slug: 'corporativo', icon: 'work' },
    { name: 'Industrial', slug: 'industrial', icon: 'hide_source' },
    { name: 'Bordados', slug: 'bordados', icon: 'local_laundry_service' }
]

export const orders = [
    {
        id: 'ELD-10254',
        date: '2025-05-15',
        total: 248000,
        status: 'in_transit',
        items: [
            { product: products[0], quantity: 10, subtotal: 129000 },
            { product: products[1], quantity: 5, subtotal: 114500 }
        ],
        shipping: {
            carrier: 'Chilexpress',
            tracking: '987654321',
            estimatedDelivery: '2025-05-24'
        }
    }
]

export const solutions = [
    {
        id: 1,
        title: 'Línea Corporativa',
        description: 'Poleras polo, camisas y prendas para imagen profesional',
        icon: 'work',
        image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&h=450&fit=crop',
        link: '/catalogo?categoria=corporativo',
        features: ['Poleras Piqué', 'Camisas formales', 'Chaquetas ejecutivas']
    },
    {
        id: 2,
        title: 'Línea Industrial',
        description: 'Pantalones cargo, chalecos geólogo y prendas resistentes',
        icon: 'construction',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=450&fit=crop',
        link: '/catalogo?categoria=industrial',
        features: ['Pantalones Cargo', 'Chalecos Geólogo', 'Jeans reforzados']
    },
    {
        id: 3,
        title: 'Bordado Profesional',
        description: 'Bordado de logos de alta calidad en todas tus prendas',
        icon: 'brush',
        image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&h=450&fit=crop',
        link: '/catalogo?categoria=bordados',
        features: ['Hasta 15,000 puntadas', 'Alta definición', 'Colores personalizados']
    },
    {
        id: 4,
        title: 'Equipos Pequeños',
        description: 'Soluciones flexibles desde 10 unidades combinables',
        icon: 'groups',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=450&fit=crop',
        link: '/catalogo',
        features: ['10 unidades mínimo', 'Combinación de tallas', 'Mezcla de colores']
    }
]
