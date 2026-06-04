// src/pages/public/InvoicePage.jsx
import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../../components/ui/Icon'
import api from '../../config/api'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function InvoicePage() {
    const { orderId } = useParams()
    const { isAuthenticated, user } = useAuth()
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [generatingPDF, setGeneratingPDF] = useState(false)
    const invoiceRef = useRef(null)

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/factura/${orderId}` } })
            return
        }

        const fetchOrder = async () => {
            try {
                setLoading(true)
                const orderData = await api.orders.getById(orderId)
                setOrder(orderData)
            } catch (err) {
                console.error('Error fetching order:', err)
                setError(err.message || 'No se pudo cargar la factura')
            } finally {
                setLoading(false)
            }
        }

        if (orderId) {
            fetchOrder()
        }
    }, [orderId, isAuthenticated, navigate])

    const downloadPDF = async () => {
        if (!invoiceRef.current) return

        setGeneratingPDF(true)

        try {
            const element = invoiceRef.current

            // Configurar estilos temporales para la captura
            const originalStyles = {
                backgroundColor: element.style.backgroundColor,
                color: element.style.color
            }

            // Asegurar que los colores sean compatibles
            element.style.backgroundColor = '#ffffff'

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                // Ignorar colores oklab
                onclone: (clonedDoc, element) => {
                    // Forzar colores compatibles en el clon
                    const allElements = clonedDoc.querySelectorAll('*')
                    allElements.forEach(el => {
                        if (el.style) {
                            // Reemplazar cualquier color problemático
                            const bgColor = el.style.backgroundColor
                            if (bgColor && bgColor.includes('oklab')) {
                                el.style.backgroundColor = '#ffffff'
                            }
                            const color = el.style.color
                            if (color && color.includes('oklab')) {
                                el.style.color = '#000000'
                            }
                        }
                    })
                }
            })

            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            const imgWidth = 210 // A4 width in mm
            const pageHeight = 297 // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width
            let heightLeft = imgHeight
            let position = 0

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight
                pdf.addPage()
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
                heightLeft -= pageHeight
            }

            pdf.save(`factura_${orderId}.pdf`)
        } catch (error) {
            console.error('Error generating PDF:', error)
            alert('Error al generar el PDF. Por favor, intenta nuevamente.')
        } finally {
            setGeneratingPDF(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-500">Cargando factura...</p>
                </div>
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="max-w-[1280px] mx-auto px-8 py-20 text-center">
                <Icon name="error" className="text-6xl text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-primary mb-4">Factura no encontrada</h1>
                <p className="text-gray-600 mb-8">{error || 'No se pudo encontrar la factura solicitada.'}</p>
                <Link to="/" className="bg-[#FC9430] text-white px-6 py-3 font-bold uppercase inline-block hover:bg-[#e0852b] transition-colors rounded">
                    Volver al inicio
                </Link>
            </div>
        )
    }

    // Calcular valores
    const subtotal = order.items?.reduce((sum, item) => sum + (parseFloat(item.subtotal) || 0), 0) || parseFloat(order.total) || 0
    const shippingCost = 4500
    const iva = subtotal * 0.19
    const total = subtotal + shippingCost + iva
    const orderDate = new Date(order.createdAt).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Botones de acción */}
                <div className="flex justify-end gap-4 mb-6">
                    <button
                        onClick={() => window.print()}
                        className="bg-gray-600 text-white px-6 py-2 font-bold uppercase rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <Icon name="print" className="text-sm" />
                        Imprimir
                    </button>
                    <button
                        onClick={downloadPDF}
                        disabled={generatingPDF}
                        className="bg-[#FC9430] text-white px-6 py-2 font-bold uppercase rounded-lg hover:bg-[#e0852b] transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {generatingPDF ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Generando...
                            </>
                        ) : (
                            <>
                                <Icon name="download" className="text-sm" />
                                Descargar Factura PDF
                            </>
                        )}
                    </button>
                </div>

                {/* Factura - Usando estilos inline para evitar conflictos con Tailwind v4 */}
                <div
                    ref={invoiceRef}
                    className="bg-white shadow-xl rounded-lg overflow-hidden"
                    style={{ backgroundColor: '#ffffff', color: '#000000' }}
                >
                    {/* Header */}
                    <div style={{ backgroundColor: '#00265b', color: '#ffffff', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>EL DESCUVEE</h1>
                                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginTop: '4px' }}>Ropa Corporativa y Bordado Profesional</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>FACTURA</p>
                                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>N° {orderId?.slice(-8) || '00000000'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Información de la empresa */}
                    <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <h3 style={{ fontWeight: 'bold', color: '#00265b', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Empresa Emisora</h3>
                                <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.5' }}>
                                    <p><strong>Razón Social:</strong> El Descuevee SpA</p>
                                    <p><strong>RUT:</strong> 77.123.456-7</p>
                                    <p><strong>Dirección:</strong> Av. Los Pioneros 1234, La Serena</p>
                                    <p><strong>Teléfono:</strong> +56 51 234 5678</p>
                                    <p><strong>Email:</strong> ventas@eldescuevee.cl</p>
                                </div>
                            </div>
                            <div>
                                <h3 style={{ fontWeight: 'bold', color: '#00265b', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Cliente</h3>
                                <div style={{ fontSize: '12px', color: '#4b5563', lineHeight: '1.5' }}>
                                    <p><strong>Nombre:</strong> {user?.name || 'Cliente'}</p>
                                    <p><strong>Email:</strong> {user?.email || '-'}</p>
                                    <p><strong>Teléfono:</strong> {user?.phone || '-'}</p>
                                    {user?.company && <p><strong>Empresa:</strong> {user.company}</p>}
                                    {user?.rut && <p><strong>RUT:</strong> {user.rut}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fecha de emisión */}
                    <div style={{ padding: '12px 24px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                            <span style={{ fontWeight: 'bold', color: '#4b5563' }}>Fecha de Emisión:</span>
                            <span style={{ color: '#1f2937' }}>{orderDate}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px' }}>
                            <span style={{ fontWeight: 'bold', color: '#4b5563' }}>Condiciones de Pago:</span>
                            <span style={{ color: '#1f2937' }}>Transferencia / Depósito / Factura 30 días</span>
                        </div>
                    </div>

                    {/* Productos */}
                    <div style={{ padding: '24px' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#00265b', fontSize: '12px', textTransform: 'uppercase', marginBottom: '16px' }}>Detalle de Productos</h3>
                        <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                            <thead style={{ backgroundColor: '#f3f4f6' }}>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: '8px' }}>Código</th>
                                    <th style={{ textAlign: 'left', padding: '8px' }}>Producto</th>
                                    <th style={{ textAlign: 'right', padding: '8px' }}>Cantidad</th>
                                    <th style={{ textAlign: 'right', padding: '8px' }}>Precio Unitario</th>
                                    <th style={{ textAlign: 'right', padding: '8px' }}>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items?.map((item, index) => (
                                    <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '8px', color: '#6b7280' }}>{item.product?.reference || '-'}</td>
                                        <td style={{ padding: '8px', fontWeight: '500' }}>{item.product?.name || 'Producto'}</td>
                                        <td style={{ padding: '8px', textAlign: 'right' }}>{item.quantity}</td>
                                        <td style={{ padding: '8px', textAlign: 'right' }}>${(parseFloat(item.unitPrice) || 0).toLocaleString()}</td>
                                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}>${(parseFloat(item.subtotal) || 0).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Resumen de valores */}
                    <div style={{ padding: '24px', backgroundColor: '#f9fafb' }}>
                        <div style={{ maxWidth: '300px', marginLeft: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                                <span style={{ color: '#4b5563' }}>Subtotal:</span>
                                <span style={{ fontWeight: '500' }}>${Math.round(subtotal).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                                <span style={{ color: '#4b5563' }}>Envío (La Serena - Calbuco):</span>
                                <span style={{ fontWeight: '500' }}>${shippingCost.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                                <span style={{ color: '#4b5563' }}>IVA (19%):</span>
                                <span style={{ fontWeight: '500' }}>${Math.round(iva).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', paddingTop: '8px', borderTop: '1px solid #d1d5db', marginTop: '8px' }}>
                                <span style={{ color: '#00265b' }}>Total:</span>
                                <span style={{ color: '#FC9430' }}>${Math.round(total).toLocaleString()} CLP</span>
                            </div>
                        </div>
                    </div>

                    {/* Información adicional */}
                    <div style={{ padding: '24px', borderTop: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            <div>
                                <h4 style={{ fontWeight: 'bold', color: '#00265b', fontSize: '10px', textTransform: 'uppercase', marginBottom: '8px' }}>Observaciones</h4>
                                <p style={{ fontSize: '10px', color: '#6b7280' }}>
                                    * El bordado de logo está incluido en el precio de las prendas.<br />
                                    * Los tiempos de entrega son de 5-7 días hábiles.<br />
                                    * Para productos con bordado, sumar 2-3 días adicionales.
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ display: 'inline-block', textAlign: 'center' }}>
                                    <div style={{ width: '128px', height: '64px', border: '1px solid #d1d5db', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <p style={{ fontSize: '8px', color: '#9ca3af' }}>Sello y Firma</p>
                                    </div>
                                    <p style={{ fontSize: '10px', color: '#6b7280' }}>El Descuevee SpA</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ backgroundColor: '#f3f4f6', padding: '16px 24px', textAlign: 'center', fontSize: '10px', color: '#6b7280' }}>
                        <p>Este documento es una factura electrónica válida según la Ley N° 21.420.</p>
                        <p style={{ marginTop: '4px' }}>Ante cualquier consulta, contáctanos a ventas@eldescuevee.cl o al +56 51 234 5678</p>
                    </div>
                </div>
            </div>
        </div>
    )
}