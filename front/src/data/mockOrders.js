// Datos mock de pedidos para seguimiento
export const mockOrders = [
    {
        id: 'ELD-10254',
        date: '2025-05-12',
        total: 248000,
        status: 'pending', // Pedido Recibido
        statusLabel: 'Pedido Recibido',
        customer: {
            name: 'Minera Las Ánimas',
            email: 'contacto@mineralasanimas.cl',
            phone: '+56 9 8765 4321'
        },
        shipping: {
            carrier: 'Chilexpress',
            trackingNumber: '987654321',
            estimatedDelivery: '2025-05-24',
            address: 'Av. Industrial 4500, Oficina 302, Antofagasta',
            currentLocation: 'Planta La Serena',
            lastUpdate: '2025-05-12 15:30',
            history: [
                { status: 'Pedido Recibido', date: '2025-05-12 15:30', location: 'Online', completed: true },
                { status: 'En Preparación', date: null, location: null, completed: false },
                { status: 'En Tránsito', date: null, location: null, completed: false },
                { status: 'Entregado', date: null, location: null, completed: false }
            ]
        },
        items: [
            {
                id: 1,
                name: 'Polera Polo Piqué',
                reference: 'POL-001',
                quantity: 10,
                price: 12900,
                subtotal: 129000,
                image: 'https://comerciallamas.cl/wp-content/uploads/2023/04/polera-polo-mc-hombre-60-alg-40-poly-18.jpg'
            },
            {
                id: 2,
                name: 'Micropolar Térmico',
                reference: 'MIC-045',
                quantity: 5,
                price: 22900,
                subtotal: 114500,
                image: 'https://uniformessami.cl/cdn/shop/files/micropolar-termico-ml-mujer-100-poly_3.jpg'
            }
        ]
    },
    {
        id: 'ELD-9918',
        date: '2025-05-10',
        total: 156000,
        status: 'preparation', // En Preparación
        statusLabel: 'En Preparación',
        customer: {
            name: 'Constructora Titán',
            email: 'ventas@titan.cl',
            phone: '+56 9 7654 3210'
        },
        shipping: {
            carrier: 'Starken',
            trackingNumber: '123456789',
            estimatedDelivery: '2025-05-20',
            address: 'Av. Las Industrias 450, Quilicura, Santiago',
            currentLocation: 'Taller de Bordado',
            lastUpdate: '2025-05-11 11:00',
            history: [
                { status: 'Pedido Recibido', date: '2025-05-10 09:00', location: 'Online', completed: true },
                { status: 'En Preparación', date: '2025-05-11 11:00', location: 'Taller de Bordado', completed: true },
                { status: 'En Tránsito', date: null, location: null, completed: false },
                { status: 'Entregado', date: null, location: null, completed: false }
            ]
        },
        items: [
            {
                id: 1,
                name: 'Polera Polo Piqué',
                reference: 'POL-001',
                quantity: 8,
                price: 12900,
                subtotal: 103200,
                image: 'https://comerciallamas.cl/wp-content/uploads/2023/04/polera-polo-mc-hombre-60-alg-40-poly-18.jpg'
            },
            {
                id: 3,
                name: 'Pantalón Cargo Industrial',
                reference: 'CAR-012',
                quantity: 2,
                price: 26400,
                subtotal: 52800,
                image: 'https://tworldstore.cl/6139-superlarge_default/pantalon-cargo-gabardina-forro-polar-hombre.jpg'
            }
        ]
    },
    {
        id: 'ELD-9915',
        date: '2025-05-08',
        total: 345000,
        status: 'transit', // En Tránsito
        statusLabel: 'En Tránsito',
        customer: {
            name: 'Industrias López',
            email: 'compras@industriaslopez.cl',
            phone: '+56 9 6543 2109'
        },
        shipping: {
            carrier: 'Chilexpress',
            trackingNumber: '987654318',
            estimatedDelivery: '2025-05-15',
            address: 'Av. Collao 1200, Concepción',
            currentLocation: 'Ruta hacia Concepción',
            lastUpdate: '2025-05-13 08:00',
            history: [
                { status: 'Pedido Recibido', date: '2025-05-08 09:00', location: 'Online', completed: true },
                { status: 'En Preparación', date: '2025-05-09 11:00', location: 'Planta La Serena', completed: true },
                { status: 'En Tránsito', date: '2025-05-13 08:00', location: 'Ruta hacia Concepción', completed: true },
                { status: 'Entregado', date: null, location: null, completed: false }
            ]
        },
        items: [
            {
                id: 3,
                name: 'Pantalón Cargo Industrial',
                reference: 'CAR-012',
                quantity: 10,
                price: 28900,
                subtotal: 289000,
                image: 'https://tworldstore.cl/6139-superlarge_default/pantalon-cargo-gabardina-forro-polar-hombre.jpg'
            },
            {
                id: 2,
                name: 'Micropolar Térmico',
                reference: 'MIC-045',
                quantity: 2,
                price: 22900,
                subtotal: 45800,
                image: 'https://uniformessami.cl/cdn/shop/files/micropolar-termico-ml-mujer-100-poly_3.jpg'
            },
            {
                id: 4,
                name: 'Chaleco Geólogo',
                reference: 'GEO-001',
                quantity: 1,
                price: 32900,
                subtotal: 32900,
                image: 'https://www.apro.cl/cdn/shop/files/CHALECOEXOSETGEOLOGONARANJO-AZUL.jpg'
            }
        ]
    },
    {
        id: 'ELD-9910',
        date: '2025-05-01',
        total: 124000,
        status: 'delivered', // Entregado
        statusLabel: 'Entregado',
        customer: {
            name: 'Logística Global',
            email: 'despachos@logisticaglobal.cl',
            phone: '+56 9 5432 1098'
        },
        shipping: {
            carrier: 'Starken',
            trackingNumber: '123456788',
            estimatedDelivery: '2025-05-10',
            deliveredDate: '2025-05-09',
            address: 'Av. Francisco de Aguirre 500, La Serena',
            currentLocation: 'Entregado al destinatario',
            lastUpdate: '2025-05-09 16:45',
            history: [
                { status: 'Pedido Recibido', date: '2025-05-01 09:00', location: 'Online', completed: true },
                { status: 'En Preparación', date: '2025-05-02 11:00', location: 'Planta La Serena', completed: true },
                { status: 'En Tránsito', date: '2025-05-05 08:00', location: 'Ruta hacia La Serena', completed: true },
                { status: 'Entregado', date: '2025-05-09 16:45', location: 'La Serena', completed: true }
            ]
        },
        items: [
            {
                id: 1,
                name: 'Polera Polo Piqué',
                reference: 'POL-001',
                quantity: 10,
                price: 12900,
                subtotal: 129000,
                image: 'https://comerciallamas.cl/wp-content/uploads/2023/04/polera-polo-mc-hombre-60-alg-40-poly-18.jpg'
            }
        ]
    }
]

// Función para obtener un pedido por ID
export const getOrderById = (orderId) => {
    return mockOrders.find(order => order.id === orderId)
}

// Función para obtener todos los pedidos
export const getAllOrders = () => {
    return mockOrders
}

// Función para obtener pedidos por estado
export const getOrdersByStatus = (status) => {
    return mockOrders.filter(order => order.status === status)
}

export default mockOrders