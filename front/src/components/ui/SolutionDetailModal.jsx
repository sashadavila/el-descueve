import { Link } from 'react-router-dom'
import Modal from './Modal'
import Icon from './Icon'

export default function SolutionDetailModal({ isOpen, onClose, solution }) {
    if (!solution) return null

    const solutionDetails = {
        corporativo: {
            title: 'Línea Corporativa',
            description: 'Prendas profesionales para imagen corporativa con bordado personalizado.',
            features: [
                'Poleras Polo Piqué 100% algodón',
                'Camisas formales resistentes',
                'Chaquetas ejecutivas',
                'Bordado de logo incluido',
                'Colores corporativos personalizables',
                'Tallas desde S hasta 3XL'
            ],
            benefits: [
                'Imagen profesional unificada',
                'Alta durabilidad en lavado',
                'Telas transpirables',
                'Mantiene su forma después de múltiples lavados'
            ],
            price: 'Desde $12.900 CLP',
            minOrder: 'Mínimo 10 unidades combinables',
            image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=600&h=400&fit=crop'
        },
        industrial: {
            title: 'Línea Industrial',
            description: 'Ropa de trabajo resistente para terrenos exigentes y operaciones diarias.',
            features: [
                'Pantalones Cargo con múltiples bolsillos',
                'Chalecos Geólogo reflectantes',
                'Jeans de trabajo reforzados',
                'Telas resistentes a desgarros',
                'Costuras dobles para mayor durabilidad',
                'Tallas especiales disponibles'
            ],
            benefits: [
                'Máxima resistencia y durabilidad',
                'Protección en terrenos difíciles',
                'Comodidad para jornadas largas',
                'Refuerzos en zonas de desgaste'
            ],
            price: 'Desde $28.900 CLP',
            minOrder: 'Mínimo 10 unidades combinables',
            image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop'
        },
        bordado: {
            title: 'Bordado Profesional',
            description: 'Bordado de logos de alta calidad en todas tus prendas corporativas.',
            features: [
                'Hasta 15,000 puntadas de alta definición',
                'Máquinas de última generación',
                'Más de 100 colores de hilo disponibles',
                'Bordado 3D (volumen) opcional',
                'Digitalización de logo incluida',
                'Calidad que perdura en el tiempo'
            ],
            benefits: [
                'Acabado profesional impecable',
                'Resistencia a lavados industriales',
                'Colores fieles al original',
                'Detalles nítidos en letras pequeñas'
            ],
            price: 'Desde $10.000 CLP',
            minOrder: 'Incluido en el precio de la prenda',
            image: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&h=400&fit=crop'
        },
        equipos: {
            title: 'Equipos Pequeños',
            description: 'Soluciones flexibles para equipos de trabajo de todos los tamaños.',
            features: [
                'Pedido mínimo de 10 unidades',
                'Combinación de diferentes prendas',
                'Mezcla de tallas sin recargo',
                'Mezcla de colores disponible',
                'Entrega en toda la zona centro-sur',
                'Cotización en menos de 24 horas'
            ],
            benefits: [
                'Flexibilidad para equipos pequeños',
                'Sin stock mínimo excesivo',
                'Precios competitivos desde la primera unidad',
                'Atención personalizada'
            ],
            price: 'Precios corporativos especiales',
            minOrder: 'Mínimo 10 unidades combinables',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop'
        }
    }

    const details = solutionDetails[solution.id]

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={details.title}>
            <div className="space-y-6">
                {/* Imagen */}
                <div className="aspect-video rounded-lg overflow-hidden">
                    <img
                        src={details.image}
                        alt={details.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Descripción */}
                <p className="text-gray-600">{details.description}</p>

                {/* Beneficios */}
                <div>
                    <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                        <Icon name="stars" className="text-[#FC9430]" />
                        Beneficios
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {details.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                                <Icon name="check_circle" className="text-[#FC9430] text-sm" />
                                <span>{benefit}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Características */}
                <div>
                    <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                        <Icon name="settings" className="text-[#FC9430]" />
                        Características
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {details.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                                <Icon name="check" className="text-[#FC9430] text-sm" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Precio y acciones */}
                <div className="bg-slate-50 p-4 rounded-lg mt-4">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-sm text-gray-500">Precio desde</p>
                            <p className="text-2xl font-bold text-[#FC9430]">{details.price}</p>
                            <p className="text-xs text-gray-500">{details.minOrder}</p>
                        </div>
                        <div>
                            <Link
                                to="/catalogo"
                                className="bg-primary text-white px-6 py-2 font-bold uppercase text-sm hover:bg-[#FC9430] transition-colors rounded"
                                onClick={onClose}
                            >
                                Ver Catálogo
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Contacto directo */}
                <div className="border-t pt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">¿Necesitas más información?</p>
                    <a
                        href="https://wa.me/56912345678?text=Hola,%20quisiera%20más%20información%20sobre%20la%20línea%20corporativa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#25D366] hover:underline font-bold"
                    >
                        <Icon name="chat" />
                        Contáctanos por WhatsApp
                    </a>
                </div>
            </div>
        </Modal>
    )
}