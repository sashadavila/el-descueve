export const equiposProducts = [
    {
        id: 'EQU-001',
        name: 'Set Starter Corporativo',
        reference: 'SET-STR-001',
        price: 45900,
        category: 'Equipos Trabajo',
        subcategory: 'Kits',
        image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400&h=400&fit=crop',
        description: 'Set básico para equipos pequeños: 2 Poleras Polo + 1 Camisa. Bordado incluido.',
        features: [
            '2 Poleras Polo Piqué',
            '1 Camisa Formal Ejecutiva',
            'Bordado de logo en todas las prendas',
            'Precio especial por kit',
            'Combina tallas y colores',
            'Ideal para equipos de 5-10 personas'
        ],
        includes: [
            '2 Poleras Polo Piqué',
            '1 Camisa Formal Ejecutiva'
        ],
        minOrder: 1,
        inStock: true,
        stock: 500,
        isNew: false,
        isFeatured: true,
        hasDiscount: true,
        discount: 15,
        embroidery: {
            included: true,
            maxStitches: 15000,
            colors: 6,
            positions: ['Pecho izquierdo']
        }
    },
    {
        id: 'EQU-002',
        name: 'Set Industrial Básico',
        reference: 'SET-IND-001',
        price: 78900,
        category: 'Equipos Trabajo',
        subcategory: 'Kits',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
        description: 'Set industrial: 2 Pantalones Cargo + 2 Poleras Micropolar. Bordado incluido.',
        features: [
            '2 Pantalones Cargo Industrial',
            '2 Poleras Micropolar Térmicas',
            'Refuerzos en zonas críticas',
            'Bordado de logo en todas las prendas',
            'Ideal para faenas',
            'Alta durabilidad'
        ],
        includes: [
            '2 Pantalones Cargo Industrial',
            '2 Poleras Micropolar Térmicas'
        ],
        minOrder: 1,
        inStock: true,
        stock: 300,
        isNew: true,
        isFeatured: true,
        hasDiscount: true,
        discount: 10,
        reinforcement: true,
        embroidery: {
            included: true,
            maxStitches: 15000,
            colors: 4,
            positions: ['Bolsillo', 'Pecho']
        }
    },
    {
        id: 'EQU-003',
        name: 'Set Ejecutivo Premium',
        reference: 'SET-PRE-001',
        price: 129900,
        category: 'Equipos Trabajo',
        subcategory: 'Kits',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
        description: 'Set ejecutivo completo: Camisa + Chaqueta + Polera. Bordado premium incluido.',
        features: [
            '1 Camisa Formal Ejecutiva',
            '1 Chaqueta Corporativa',
            '1 Polera Polo Piqué',
            'Bordado 3D disponible',
            'Acabados premium',
            'Ideal para gerencias'
        ],
        includes: [
            '1 Camisa Formal Ejecutiva',
            '1 Chaqueta Corporativa',
            '1 Polera Polo Piqué'
        ],
        minOrder: 1,
        inStock: true,
        stock: 150,
        isNew: true,
        isFeatured: true,
        hasDiscount: false,
        discount: 0,
        embroidery: {
            included: true,
            maxStitches: 18000,
            colors: 6,
            positions: ['Pecho izquierdo', 'Manga', 'Espalda']
        }
    }
]

export default equiposProducts