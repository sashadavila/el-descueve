export const industrialProducts = [
    {
        id: 'IND-001',
        name: 'Pantalón Cargo Industrial',
        reference: 'CAR-012',
        price: 28900,
        category: 'Industrial',
        subcategory: 'Pantalones',
        image: 'https://tworldstore.cl/6139-superlarge_default/pantalon-cargo-gabardina-forro-polar-hombre.jpg',
        images: [
            'https://tworldstore.cl/6139-superlarge_default/pantalon-cargo-gabardina-forro-polar-hombre.jpg',
            'https://www.brahma.co/images/11775/fit-w-960'
        ],
        description: 'Pantalón cargo con múltiples bolsillos, tela resistente para terreno y operación diaria. Reforzado en zonas críticas.',
        features: [
            '65% Poliéster / 35% Algodón',
            'Múltiples bolsillos con cierre',
            'Refuerzos en rodillas y entrepierna',
            'Cintura elastizada parcial',
            'Resistente a desgarros',
            'Ideal para faenas y terreno'
        ],
        material: '65% Poliéster / 35% Algodón Oxford',
        weight: '280 gr/m²',
        colors: ['#4A5D23', '#2C2C2C', '#8B7355', '#1F2937'],
        sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
        minOrder: 10,
        inStock: true,
        stock: 150,
        isNew: false,
        isFeatured: true,
        hasDiscount: false,
        discount: 0,
        reinforcement: true,
        embroidery: {
            included: true,
            maxStitches: 15000,
            colors: 4,
            positions: ['Bolsillo delantero', 'Espalda']
        }
    },
    {
        id: 'IND-002',
        name: 'Chaleco Geólogo',
        reference: 'GEO-001',
        price: 32900,
        category: 'Industrial',
        subcategory: 'Chalecos',
        image: 'https://www.apro.cl/cdn/shop/files/CHALECOEXOSETGEOLOGONARANJO-AZUL.jpg',
        description: 'Chaleco geólogo duradero y reflectante, ideal para minería, construcción y terreno. Múltiples bolsillos y cintas reflectantes.',
        features: [
            '100% Poliéster Oxford 600D',
            'Cintas reflectantes 3M',
            'Múltiples bolsillos con cierre',
            'Espalda acolchada',
            'Refuerzos en zonas de roce',
            'Ideal para minera y construcción'
        ],
        material: 'Poliéster Oxford 600D',
        weight: '300 gr/m²',
        colors: ['#EA580C', '#1E3A8A', '#15803D', '#DC2626'],
        sizes: ['S', 'M', 'L', 'XL', '2XL'],
        minOrder: 10,
        inStock: true,
        stock: 120,
        isNew: false,
        isFeatured: true,
        hasDiscount: true,
        discount: 10,
        reflective: true,
        embroidery: {
            included: true,
            maxStitches: 15000,
            colors: 4,
            positions: ['Pecho izquierdo', 'Espalda']
        }
    },
    {
        id: 'IND-003',
        name: 'Jean de Trabajo Reforzado',
        reference: 'JEA-001',
        price: 34500,
        category: 'Industrial',
        subcategory: 'Jeans',
        image: 'https://i0.wp.com/ipialesdelsur.com/wp-content/uploads/2024/08/pantalon-j.jpg?fit=600%2C600&ssl=1',
        description: 'Jean de trabajo con denim reforzado, costuras dobles para máxima durabilidad en faenas exigentes.',
        features: [
            '100% Algodón Denim',
            'Costuras dobles reforzadas',
            'Presillas para herramientas',
            'Bolsillo especial para celular',
            'Resistente a abrasión',
            'Ideal para trabajo pesado'
        ],
        material: '100% Algodón Denim',
        weight: '320 gr/m²',
        colors: ['#1E3A8A', '#2C2C2C', '#4A5D23'],
        sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
        minOrder: 10,
        inStock: true,
        stock: 80,
        isNew: true,
        isFeatured: false,
        hasDiscount: false,
        discount: 0,
        reinforcement: true,
        embroidery: {
            included: true,
            maxStitches: 15000,
            colors: 4,
            positions: ['Bolsillo trasero', 'Pretina']
        }
    },
    {
        id: 'IND-004',
        name: 'Polera Micropolar Térmica',
        reference: 'MIC-045',
        price: 22900,
        category: 'Industrial',
        subcategory: 'Poleras Térmicas',
        image: 'https://uniformessami.cl/cdn/shop/files/micropolar-termico-ml-mujer-100-poly_3.jpg',
        description: 'Polera micropolar térmica, abrigo ligero ideal para oficina y terreno. Bordado de logo incluido.',
        features: [
            '100% Poliéster Micropolar',
            'Abrigo ligero y transpirable',
            'Mantiene el calor corporal',
            'Secado rápido',
            'Resistente a pillings',
            'Ideal para climas fríos'
        ],
        material: '100% Poliéster Micropolar',
        weight: '280 gr/m²',
        colors: ['#4B5563', '#1F2937', '#0F172A', '#15803D'],
        sizes: ['S', 'M', 'L', 'XL', '2XL'],
        minOrder: 10,
        inStock: true,
        stock: 200,
        isNew: false,
        isFeatured: true,
        hasDiscount: true,
        discount: 15,
        thermal: true,
        embroidery: {
            included: true,
            maxStitches: 15000,
            colors: 6,
            positions: ['Pecho izquierdo', 'Manga', 'Espalda']
        }
    }
]

export default industrialProducts