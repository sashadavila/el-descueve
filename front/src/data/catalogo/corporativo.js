export const corporativoProducts = [
    {
        id: 'COR-001',
        name: 'Polera Polo Piqué',
        reference: 'POL-001',
        price: 12900,
        category: 'Corporativo',
        subcategory: 'Poleras',
        image: 'https://comerciallamas.cl/wp-content/uploads/2023/04/polera-polo-mc-hombre-60-alg-40-poly-18.jpg',
        images: [
            'https://comerciallamas.cl/wp-content/uploads/2023/04/polera-polo-mc-hombre-60-alg-40-poly-18.jpg',
            'https://texled.cl/wp-content/uploads/2020/12/RTN.0101.07.12-POLERA-PIQUE-VERDE-CATA-M-CORTA-MUJER.jpg',
            'https://portalropaempresas.cl/wp-content/uploads/2017/08/polera-pique-mujer-m-c-80-alg-20-poly-230g-certificada-blanco-t-xs-1.jpg'
        ],
        description: 'Polera polo en algodón piqué, ideal para imagen corporativa. Incluye bordado de logo en el pecho. Calidad profesional que dura.',
        features: [
            '100% Algodón Piqué - 210 gr/m²',
            'Cuello y puños en rib acanalado que no se deforma',
            'Botones duraderos en tono contrastante',
            'Bordado de logo profesional incluido',
            'Pretratado antiarrugas',
            'Lavabilidad industrial'
        ],
        material: '100% Algodón Piqué',
        weight: '210 gr/m²',
        colors: ['#163C7A', '#B91C1C', '#111827', '#FFFFFF', '#4A7C59'],
        sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
        minOrder: 10,
        inStock: true,
        stock: 250,
        isNew: false,
        isFeatured: true,
        hasDiscount: false,
        discount: 0,
        embroidery: {
            included: true,
            maxStitches: 15000,
            colors: 6,
            positions: ['Pecho izquierdo', 'Pecho derecho', 'Manga izquierda', 'Manga derecha', 'Espalda']
        }
    },
    {
        id: 'COR-002',
        name: 'Camisa Formal Ejecutiva',
        reference: 'CAM-001',
        price: 18900,
        category: 'Corporativo',
        subcategory: 'Camisas',
        image: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=400&h=400&fit=crop',
        description: 'Camisa formal de alta calidad para ejecutivos. Tela antiarrugas y bordado de logo incluido.',
        features: [
            '65% Poliéster / 35% Algodón',
            'Tecnología antiarrugas',
            'Puños con doble botón',
            'Bordado de logo incluido',
            'Planchado fácil',
            'Ideal para reuniones y presentaciones'
        ],
        material: '65% Poliéster / 35% Algodón',
        weight: '180 gr/m²',
        colors: ['#FFFFFF', '#163C7A', '#E5E7EB', '#1F2937'],
        sizes: ['S', 'M', 'L', 'XL', '2XL'],
        minOrder: 10,
        inStock: true,
        stock: 180,
        isNew: true,
        isFeatured: true,
        hasDiscount: false,
        discount: 0,
        embroidery: {
            included: true,
            maxStitches: 12000,
            colors: 4,
            positions: ['Pecho izquierdo', 'Manga']
        }
    },
    {
        id: 'COR-003',
        name: 'Chaqueta Corporativa',
        reference: 'CHA-001',
        price: 45900,
        category: 'Corporativo',
        subcategory: 'Chaquetas',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop',
        description: 'Chaqueta ejecutiva impermeable, ideal para clima variable. Bordado de logo incluido.',
        features: [
            '100% Poliéster con tratamiento impermeable',
            'Forro interior térmico desmontable',
            'Capucha oculta en cuello',
            'Múltiples bolsillos con cierre',
            'Bordado de logo incluido',
            'Ideal para exteriores'
        ],
        material: '100% Poliéster Impermeable',
        weight: '250 gr/m²',
        colors: ['#163C7A', '#1F2937', '#4B5563'],
        sizes: ['S', 'M', 'L', 'XL', '2XL'],
        minOrder: 10,
        inStock: true,
        stock: 95,
        isNew: true,
        isFeatured: false,
        hasDiscount: false,
        discount: 0,
        embroidery: {
            included: true,
            maxStitches: 18000,
            colors: 4,
            positions: ['Pecho izquierdo', 'Manga', 'Espalda']
        }
    },
    {
        id: 'COR-004',
        name: 'Polera Manga Larga',
        reference: 'POL-002',
        price: 14900,
        category: 'Corporativo',
        subcategory: 'Poleras',
        image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=400&fit=crop',
        description: 'Polera manga larga de algodón premium para climas fríos. Bordado de logo incluido.',
        features: [
            '100% Algodón Peinado',
            'Manga larga con puños elastizados',
            'Cuello redondo reforzado',
            'Bordado de logo incluido',
            'Ideal para oficinas con clima frío',
            'Alta durabilidad'
        ],
        material: '100% Algodón Peinado',
        weight: '190 gr/m²',
        colors: ['#163C7A', '#1F2937', '#4B5563', '#FFFFFF'],
        sizes: ['S', 'M', 'L', 'XL', '2XL'],
        minOrder: 10,
        inStock: true,
        stock: 200,
        isNew: false,
        isFeatured: false,
        hasDiscount: false,
        discount: 0,
        embroidery: {
            included: true,
            maxStitches: 15000,
            colors: 6,
            positions: ['Pecho izquierdo', 'Pecho derecho']
        }
    }
]

export default corporativoProducts