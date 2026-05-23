import { Link } from 'react-router-dom'
import Icon from '../../components/ui/Icon'

export default function TermsConditions() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-primary py-12">
                <div className="max-w-[1280px] mx-auto px-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 uppercase">Términos y Condiciones</h1>
                    <p className="text-white/80">Última actualización: Mayo 2026</p>
                </div>
            </section>

            <div className="max-w-[1280px] mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar - Índice */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-32 bg-surface-container-low p-6 rounded-lg">
                            <h3 className="font-bold text-primary mb-4 uppercase text-sm">Contenido</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#informacion-general" className="text-on-surface-variant hover:text-primary transition-colors">1. Información General</a></li>
                                <li><a href="#aceptacion" className="text-on-surface-variant hover:text-primary transition-colors">2. Aceptación de los Términos</a></li>
                                <li><a href="#productos" className="text-on-surface-variant hover:text-primary transition-colors">3. Productos y Servicios</a></li>
                                <li><a href="#precios" className="text-on-surface-variant hover:text-primary transition-colors">4. Precios y Formas de Pago</a></li>
                                <li><a href="#envios" className="text-on-surface-variant hover:text-primary transition-colors">5. Envíos y Entregas</a></li>
                                <li><a href="#devoluciones" className="text-on-surface-variant hover:text-primary transition-colors">6. Cambios y Devoluciones</a></li>
                                <li><a href="#garantias" className="text-on-surface-variant hover:text-primary transition-colors">7. Garantías</a></li>
                                <li><a href="#responsabilidad" className="text-on-surface-variant hover:text-primary transition-colors">8. Limitación de Responsabilidad</a></li>
                                <li><a href="#propiedad" className="text-on-surface-variant hover:text-primary transition-colors">9. Propiedad Intelectual</a></li>
                                <li><a href="#modificaciones" className="text-on-surface-variant hover:text-primary transition-colors">10. Modificaciones</a></li>
                                <li><a href="#legislacion" className="text-on-surface-variant hover:text-primary transition-colors">11. Legislación Aplicable</a></li>
                                <li><a href="#contacto" className="text-on-surface-variant hover:text-primary transition-colors">12. Contacto</a></li>
                            </ul>
                        </div>
                    </aside>

                    {/* Contenido principal */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white border border-outline-variant rounded-lg p-6 md:p-8">
                            <p className="text-on-surface-variant mb-6">
                                Bienvenido a <strong>El Descuevee</strong>. Estos Términos y Condiciones rigen el uso de nuestro sitio web y la compra de productos a través de nuestra plataforma.
                                Al registrarte y utilizar nuestros servicios, aceptas cumplir con los siguientes términos.
                            </p>

                            {/* Sección 1 */}
                            <section id="informacion-general" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">1. Información General</h2>
                                <div className="space-y-3 text-on-surface-variant">
                                    <p><strong>Razón Social:</strong> El Descuevee SpA</p>
                                    <p><strong>RUT:</strong> 77.123.456-7</p>
                                    <p><strong>Dirección:</strong> Av. Los Pioneros 1234, La Serena, Región de Coquimbo, Chile</p>
                                    <p><strong>Correo Electrónico:</strong> contacto@eldescuevee.cl</p>
                                    <p><strong>Teléfono:</strong> +56 51 234 5678</p>
                                </div>
                            </section>

                            {/* Sección 2 */}
                            <section id="aceptacion" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">2. Aceptación de los Términos</h2>
                                <p className="text-on-surface-variant">
                                    Al registrarte en nuestra plataforma, declaras que has leído, comprendido y aceptado estos Términos y Condiciones.
                                    Si no estás de acuerdo con alguno de estos términos, no debes utilizar nuestros servicios.
                                    Estos términos se rigen por la <strong>Ley N° 19.496 sobre Protección de los Derechos de los Consumidores</strong> y otras normas aplicables en Chile.
                                </p>
                            </section>

                            {/* Sección 3 */}
                            <section id="productos" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">3. Productos y Servicios</h2>
                                <div className="space-y-3 text-on-surface-variant">
                                    <p>El Descuevee ofrece ropa corporativa, industrial y servicios de bordado profesional.</p>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>Pedido mínimo: <strong>10 unidades combinables</strong> (mezcla de prendas, tallas y colores)</li>
                                        <li>Los productos mostrados en nuestro sitio web son representativos, pudiendo existir variaciones mínimas en color y acabado.</li>
                                        <li>El bordado de logos requiere la entrega del diseño por parte del cliente en formato vectorial (AI, SVG, PDF).</li>
                                        <li>Nos reservamos el derecho de modificar o discontinuar productos sin previo aviso.</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Sección 4 */}
                            <section id="precios" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">4. Precios y Formas de Pago</h2>
                                <div className="space-y-3 text-on-surface-variant">
                                    <p>Todos los precios están expresados en <strong>Pesos Chilenos (CLP)</strong> e incluyen IVA según la legislación vigente (Ley N° 21.420).</p>
                                    <p>Los precios son válidos solo para clientes registrados y autenticados en nuestra plataforma.</p>
                                    <p><strong>Formas de pago aceptadas:</strong></p>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>Transferencia bancaria</li>
                                        <li>Depósito en cuenta</li>
                                        <li>Factura a 30 días (sujeto a evaluación crediticia para empresas)</li>
                                    </ul>
                                    <p>El Descuevee se reserva el derecho de modificar los precios en cualquier momento, previa comunicación a los clientes.</p>
                                </div>
                            </section>

                            {/* Sección 5 */}
                            <section id="envios" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">5. Envíos y Entregas</h2>
                                <div className="space-y-3 text-on-surface-variant">
                                    <p><strong>Cobertura geográfica:</strong> Desde La Serena hasta Calbuco (Regiones de Coquimbo a Los Lagos).</p>
                                    <p><strong>Plazos de entrega:</strong></p>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>Preparación de pedidos: 3-5 días hábiles</li>
                                        <li>Bordado de logos: 2-4 días hábiles adicionales</li>
                                        <li>Envío: 3-7 días hábiles según ubicación</li>
                                    </ul>
                                    <p><strong>Transportistas aliados:</strong> Chilexpress y Starken.</p>
                                    <p>El costo de envío será informado al momento de la cotización. El Descuevee no se responsabiliza por retrasos atribuibles a terceros transportistas.</p>
                                    <p>Conforme a la Ley N° 19.496, el consumidor tiene derecho a que el producto sea entregado en el plazo acordado. En caso de retraso injustificado, podrás solicitar la resolución del contrato.</p>
                                </div>
                            </section>

                            {/* Sección 6 */}
                            <section id="devoluciones" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">6. Cambios y Devoluciones</h2>
                                <div className="space-y-3 text-on-surface-variant">
                                    <p>De acuerdo con la <strong>Ley N° 19.496</strong> (Artículo 3 bis), los consumidores tienen derecho a retractarse dentro de los <strong>10 días hábiles</strong> desde la recepción del producto, siempre que este no haya sido personalizado con bordado.</p>
                                    <p><strong>Condiciones para cambios y devoluciones:</strong></p>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>El producto debe estar en perfectas condiciones, sin uso y con sus etiquetas originales.</li>
                                        <li>Los productos con bordado personalizado no tienen derecho a retractación, salvo que presenten defectos de fabricación.</li>
                                        <li>Los gastos de envío por devoluciones serán asumidos por el cliente, excepto cuando el producto llegue en mal estado o con errores imputables a El Descuevee.</li>
                                    </ul>
                                    <p>Para solicitar un cambio o devolución, contáctanos a <strong>contacto@eldescuevee.cl</strong> dentro del plazo establecido.</p>
                                </div>
                            </section>

                            {/* Sección 7 */}
                            <section id="garantias" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">7. Garantías</h2>
                                <div className="space-y-3 text-on-surface-variant">
                                    <p>El Descuevee garantiza la calidad de sus productos contra defectos de fabricación por un período de <strong>3 meses</strong> desde la fecha de entrega, conforme a lo establecido en la Ley N° 19.496.</p>
                                    <p><strong>La garantía cubre:</strong></p>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>Defectos en materiales (telas, cierres, botones)</li>
                                        <li>Problemas en la costura (desgarros, abertura de costuras)</li>
                                        <li>Defectos en el bordado (deshilachado, errores de diseño)</li>
                                    </ul>
                                    <p><strong>No cubre:</strong></p>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>Daños por mal uso, lavado incorrecto o desgaste normal</li>
                                        <li>Modificaciones realizadas por terceros</li>
                                        <li>Variaciones de color por diferencias en monitores</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Sección 8 */}
                            <section id="responsabilidad" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">8. Limitación de Responsabilidad</h2>
                                <p className="text-on-surface-variant">
                                    En la medida máxima permitida por la ley chilena, El Descuevee no será responsable por daños indirectos, incidentales o consecuentes,
                                    incluyendo pérdida de beneficios, derivados del uso o imposibilidad de uso de nuestros productos o servicios.
                                    Nuestra responsabilidad total no excederá el monto pagado por el producto correspondiente.
                                </p>
                            </section>

                            {/* Sección 9 */}
                            <section id="propiedad" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">9. Propiedad Intelectual</h2>
                                <p className="text-on-surface-variant">
                                    Todo el contenido de este sitio web (textos, imágenes, logotipos, diseños) es propiedad de El Descuevee o de sus respectivos dueños,
                                    y está protegido por las leyes de propiedad intelectual chilenas (Ley N° 17.336 sobre Propiedad Intelectual).
                                    Queda prohibida la reproducción, distribución o modificación sin autorización expresa.
                                </p>
                            </section>

                            {/* Sección 10 */}
                            <section id="modificaciones" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">10. Modificaciones de los Términos</h2>
                                <p className="text-on-surface-variant">
                                    El Descuevee se reserva el derecho de actualizar o modificar estos Términos y Condiciones en cualquier momento.
                                    Las modificaciones serán publicadas en esta página con la fecha de actualización correspondiente.
                                    Te recomendamos revisar periódicamente esta página para estar informado de cualquier cambio.
                                </p>
                            </section>

                            {/* Sección 11 */}
                            <section id="legislacion" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">11. Legislación Aplicable y Jurisdicción</h2>
                                <p className="text-on-surface-variant">
                                    Estos Términos y Condiciones se rigen por las leyes de la <strong>República de Chile</strong>.
                                    Cualquier controversia derivada de estos términos será sometida a los tribunales ordinarios de justicia de <strong>La Serena</strong>,
                                    renunciando expresamente a cualquier otro fuero o jurisdicción que pudiera corresponder.
                                    En caso de conflictos con consumidores, se aplicará lo dispuesto en la Ley N° 19.496 y el consumidor podrá recurrir al <strong>SERNAC</strong>
                                    (Servicio Nacional del Consumidor) para la mediación correspondiente.
                                </p>
                            </section>

                            {/* Sección 12 */}
                            <section id="contacto" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">12. Contacto</h2>
                                <p className="text-on-surface-variant">
                                    Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos a través de:
                                </p>
                                <ul className="list-disc pl-6 mt-2 space-y-1 text-on-surface-variant">
                                    <li>Email: <strong>contacto@eldescuevee.cl</strong></li>
                                    <li>Teléfono: <strong>+56 51 234 5678</strong></li>
                                    <li>WhatsApp: <strong>+56 9 8765 4321</strong></li>
                                    <li>Dirección: Av. Los Pioneros 1234, La Serena</li>
                                </ul>
                            </section>

                            <div className="mt-8 pt-6 border-t border-outline-variant text-center">
                                <Link to="/signup" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 font-bold uppercase rounded-lg hover:bg-primary/80 transition-colors">
                                    <Icon name="arrow_back" />
                                    Volver al registro
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}