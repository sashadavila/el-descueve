import { Link } from 'react-router-dom'
import Icon from '../../components/ui/Icon'

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-primary py-12">
                <div className="max-w-[1280px] mx-auto px-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 uppercase">Política de Privacidad</h1>
                    <p className="text-white/80">Última actualización: Mayo 2025</p>
                </div>
            </section>

            <div className="max-w-[1280px] mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar - Índice */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-32 bg-surface-container-low p-6 rounded-lg">
                            <h3 className="font-bold text-primary mb-4 uppercase text-sm">Contenido</h3>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#introduccion" className="text-on-surface-variant hover:text-primary transition-colors">1. Introducción</a></li>
                                <li><a href="#responsable" className="text-on-surface-variant hover:text-primary transition-colors">2. Responsable del Tratamiento</a></li>
                                <li><a href="#datos-recopilados" className="text-on-surface-variant hover:text-primary transition-colors">3. Datos Personales Recopilados</a></li>
                                <li><a href="#finalidades" className="text-on-surface-variant hover:text-primary transition-colors">4. Finalidades del Tratamiento</a></li>
                                <li><a href="#base-legal" className="text-on-surface-variant hover:text-primary transition-colors">5. Base Legal</a></li>
                                <li><a href="#plazo" className="text-on-surface-variant hover:text-primary transition-colors">6. Plazo de Conservación</a></li>
                                <li><a href="#derechos-arco" className="text-on-surface-variant hover:text-primary transition-colors">7. Derechos ARCO</a></li>
                                <li><a href="#seguridad" className="text-on-surface-variant hover:text-primary transition-colors">8. Medidas de Seguridad</a></li>
                                <li><a href="#terceros" className="text-on-surface-variant hover:text-primary transition-colors">9. Transferencia a Terceros</a></li>
                                <li><a href="#cookies" className="text-on-surface-variant hover:text-primary transition-colors">10. Uso de Cookies</a></li>
                                <li><a href="#menores" className="text-on-surface-variant hover:text-primary transition-colors">11. Datos de Menores de Edad</a></li>
                                <li><a href="#actualizaciones" className="text-on-surface-variant hover:text-primary transition-colors">12. Actualizaciones</a></li>
                                <li><a href="#contacto-privacidad" className="text-on-surface-variant hover:text-primary transition-colors">13. Contacto</a></li>
                            </ul>
                        </div>
                    </aside>

                    {/* Contenido principal */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white border border-outline-variant rounded-lg p-6 md:p-8">
                            <p className="text-on-surface-variant mb-6">
                                En <strong>El Descuevee</strong>, nos comprometemos a proteger tu privacidad y tus datos personales.
                                Esta Política de Privacidad explica cómo recopilamos, usamos, almacenamos y protegemos tu información
                                en cumplimiento con la <strong>Ley N° 19.628 sobre Protección de la Vida Privada</strong> y la
                                <strong> Ley N° 21.096 de Protección de Datos Personales</strong> (GDPR chileno).
                            </p>

                            {/* Sección 1 */}
                            <section id="introduccion" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">1. Introducción</h2>
                                <p className="text-on-surface-variant">
                                    Esta Política de Privacidad aplica a todos los usuarios que interactúan con nuestro sitio web,
                                    se registran en nuestra plataforma, realizan compras o contactan con nosotros.
                                    Al proporcionarnos tus datos personales, aceptas las prácticas descritas en este documento,
                                    de acuerdo con la legislación chilena vigente en materia de protección de datos personales.
                                </p>
                            </section>

                            {/* Sección 2 */}
                            <section id="responsable" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">2. Responsable del Tratamiento de Datos</h2>
                                <div className="space-y-2 text-on-surface-variant">
                                    <p><strong>Razón Social:</strong> El Descuevee SpA</p>
                                    <p><strong>RUT:</strong> 77.123.456-7</p>
                                    <p><strong>Dirección:</strong> Av. Los Pioneros 1234, La Serena, Región de Coquimbo, Chile</p>
                                    <p><strong>Correo Electrónico:</strong> privacidad@eldescuevee.cl</p>
                                    <p><strong>Encargado de Protección de Datos (DPO):</strong> contacto@eldescuevee.cl</p>
                                </div>
                            </section>

                            {/* Sección 3 */}
                            <section id="datos-recopilados" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">3. Datos Personales que Recopilamos</h2>
                                <div className="space-y-4 text-on-surface-variant">
                                    <div>
                                        <p className="font-bold">Datos de identificación:</p>
                                        <ul className="list-disc pl-6">
                                            <li>Nombre completo</li>
                                            <li>RUT</li>
                                            <li>Dirección</li>
                                            <li>Teléfono / WhatsApp</li>
                                            <li>Correo electrónico</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-bold">Datos de la empresa:</p>
                                        <ul className="list-disc pl-6">
                                            <li>Nombre de la empresa</li>
                                            <li>RUT de la empresa</li>
                                            <li>Giro comercial</li>
                                            <li>Dirección comercial</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-bold">Datos de navegación:</p>
                                        <ul className="list-disc pl-6">
                                            <li>Dirección IP</li>
                                            <li>Tipo de navegador</li>
                                            <li>Páginas visitadas</li>
                                            <li>Fecha y hora de acceso</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="font-bold">Datos de pago y facturación:</p>
                                        <ul className="list-disc pl-6">
                                            <li>Información bancaria (para transferencias)</li>
                                            <li>Dirección de facturación</li>
                                            <li>Historial de compras</li>
                                        </ul>
                                    </div>
                                </div>
                                <p className="mt-4 text-sm bg-surface-container-low p-3 rounded">
                                    <strong>Nota:</strong> No recopilamos datos sensibles como salud, orientación sexual, creencias religiosas o afiliación política,
                                    conforme a lo establecido en la Ley N° 19.628.
                                </p>
                            </section>

                            {/* Sección 4 */}
                            <section id="finalidades" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">4. Finalidades del Tratamiento de Datos</h2>
                                <div className="space-y-3 text-on-surface-variant">
                                    <p>Tus datos personales serán utilizados para las siguientes finalidades:</p>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li><strong>Gestión de usuarios:</strong> Crear y administrar tu cuenta en nuestra plataforma.</li>
                                        <li><strong>Procesamiento de pedidos:</strong> Gestionar cotizaciones, pedidos, facturación y envíos.</li>
                                        <li><strong>Comunicaciones comerciales:</strong> Enviar información sobre productos, promociones y novedades (solo con tu consentimiento previo).</li>
                                        <li><strong>Atención al cliente:</strong> Responder consultas, reclamos y solicitudes de garantía.</li>
                                        <li><strong>Mejora del servicio:</strong> Analizar el uso del sitio web para optimizar la experiencia de usuario.</li>
                                        <li><strong>Cumplimiento legal:</strong> Dar cumplimiento a obligaciones tributarias, contables y regulatorias (SII, SERNAC, etc.).</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Sección 5 */}
                            <section id="base-legal" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">5. Base Legal para el Tratamiento</h2>
                                <div className="space-y-3 text-on-surface-variant">
                                    <p>El tratamiento de tus datos personales se fundamenta en:</p>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li><strong>Ejecución de un contrato:</strong> Para gestionar tu registro y compras.</li>
                                        <li><strong>Consentimiento explícito:</strong> Para enviar comunicaciones comerciales.</li>
                                        <li><strong>Interés legítimo:</strong> Para mejorar nuestros servicios y prevenir fraudes.</li>
                                        <li><strong>Cumplimiento de obligaciones legales:</strong> Para cumplir con leyes chilenas (SII, SERNAC, etc.).</li>
                                    </ul>
                                </div>
                            </section>

                            {/* Sección 6 */}
                            <section id="plazo" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">6. Plazo de Conservación de Datos</h2>
                                <p className="text-on-surface-variant">
                                    Conservaremos tus datos personales mientras mantengas una cuenta activa en nuestra plataforma
                                    y por el tiempo necesario para cumplir con las finalidades descritas.
                                    Posteriormente, los datos serán bloqueados o eliminados, excepto cuando existan obligaciones legales de conservación
                                    (ej. facturación electrónica: 5 años según normativa SII).
                                </p>
                            </section>

                            {/* Sección 7 - DERECHOS ARCO (Ley 19.628) */}
                            <section id="derechos-arco" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">7. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</h2>
                                <div className="space-y-3 text-on-surface-variant">
                                    <p>
                                        De acuerdo con la <strong>Ley N° 19.628</strong> y la <strong>Ley N° 21.096</strong>, tienes los siguientes derechos sobre tus datos personales:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li><strong>Acceso:</strong> Conocer qué datos personales tenemos sobre ti.</li>
                                        <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos.</li>
                                        <li><strong>Cancelación:</strong> Solicitar la eliminación de tus datos cuando ya no sean necesarios.</li>
                                        <li><strong>Oposición:</strong> Oponerte al tratamiento de tus datos para fines específicos.</li>
                                        <li><strong>Portabilidad:</strong> Solicitar la transferencia de tus datos a otro responsable (a partir de la entrada en vigencia de la Ley N° 21.096).</li>
                                    </ul>
                                    <p className="mt-3">
                                        Para ejercer estos derechos, debes enviar una solicitud escrita a <strong>privacidad@eldescuevee.cl</strong>
                                        adjuntando una copia de tu cédula de identidad o RUT. Responderemos tu solicitud dentro de los <strong>10 días hábiles</strong>
                                        siguientes a su recepción, conforme a lo establecido por la ley.
                                    </p>
                                    <p>
                                        Si no recibes respuesta o esta es insatisfactoria, puedes recurrir al <strong>Consejo para la Transparencia</strong>
                                        o a los tribunales de justicia competentes.
                                    </p>
                                </div>
                            </section>

                            {/* Sección 8 */}
                            <section id="seguridad" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">8. Medidas de Seguridad</h2>
                                <p className="text-on-surface-variant">
                                    Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger tus datos personales contra
                                    acceso no autorizado, pérdida, alteración o divulgación, incluyendo:
                                </p>
                                <ul className="list-disc pl-6 mt-2 space-y-1 text-on-surface-variant">
                                    <li>Encriptación de datos sensibles (contraseñas, tokens).</li>
                                    <li>Protocolo HTTPS en todo el sitio web.</li>
                                    <li>Acceso restringido a bases de datos.</li>
                                    <li>Monitoreo continuo de vulnerabilidades.</li>
                                    <li>Capacitación periódica a nuestro personal en protección de datos.</li>
                                </ul>
                            </section>

                            {/* Sección 9 */}
                            <section id="terceros" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">9. Transferencia de Datos a Terceros</h2>
                                <div className="space-y-3 text-on-surface-variant">
                                    <p>Podemos compartir tus datos personales con las siguientes categorías de terceros:</p>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li><strong>Proveedores de servicios:</strong> Transportistas (Chilexpress, Starken), pasarelas de pago, servicios de email marketing.</li>
                                        <li><strong>Autoridades públicas:</strong> SII, SERNAC, tribunales, cuando sea requerido por ley.</li>
                                        <li><strong>Proveedores tecnológicos:</strong> Servicios de hosting, almacenamiento en la nube (dentro de Chile o países con nivel adecuado de protección).</li>
                                    </ul>
                                    <p>
                                        No vendemos, alquilamos ni comercializamos tus datos personales a terceros no relacionados con los servicios ofrecidos.
                                        En caso de transferencia internacional de datos, nos aseguramos de que el país receptor cuente con niveles de protección adecuados
                                        o que se firmen cláusulas contractuales tipo conforme a la legislación chilena.
                                    </p>
                                </div>
                            </section>

                            {/* Sección 10 */}
                            <section id="cookies" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">10. Uso de Cookies</h2>
                                <p className="text-on-surface-variant">
                                    Utilizamos cookies y tecnologías similares para mejorar tu experiencia de navegación, recordar tus preferencias
                                    y analizar el tráfico del sitio web. Puedes configurar tu navegador para rechazar todas las cookies
                                    o para notificarte cuando se envía una cookie. Sin embargo, algunas funciones del sitio podrían verse afectadas.
                                    Para más información, consulta nuestra <a href="#" className="text-[#FC9430] hover:underline">Política de Cookies</a>.
                                </p>
                            </section>

                            {/* Sección 11 */}
                            <section id="menores" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">11. Datos de Menores de Edad</h2>
                                <p className="text-on-surface-variant">
                                    Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos conscientemente datos personales de menores de edad.
                                    Si eres padre, madre o tutor y crees que tu hijo/a nos ha proporcionado datos personales, contáctanos para eliminarlos de inmediato.
                                </p>
                            </section>

                            {/* Sección 12 */}
                            <section id="actualizaciones" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">12. Actualizaciones de la Política de Privacidad</h2>
                                <p className="text-on-surface-variant">
                                    Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras prácticas
                                    o en la legislación aplicable. Te notificaremos cualquier cambio significativo a través de tu correo electrónico
                                    o mediante un aviso destacado en nuestro sitio web. La fecha de la última actualización se indica al inicio de este documento.
                                </p>
                            </section>

                            {/* Sección 13 */}
                            <section id="contacto-privacidad" className="mb-8">
                                <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b border-outline-variant">13. Contacto para Asuntos de Privacidad</h2>
                                <p className="text-on-surface-variant">
                                    Si tienes preguntas, inquietudes o deseas ejercer tus derechos ARCO, puedes contactar a nuestro
                                    <strong> Encargado de Protección de Datos</strong> a través de:
                                </p>
                                <ul className="list-disc pl-6 mt-2 space-y-1 text-on-surface-variant">
                                    <li>Email: <strong>privacidad@eldescuevee.cl</strong></li>
                                    <li>Teléfono: <strong>+56 51 234 5678</strong></li>
                                    <li>Dirección postal: Av. Los Pioneros 1234, La Serena, Chile (Ref: DPO)</li>
                                </ul>
                                <p className="mt-3">
                                    También puedes contactar al <strong>SERNAC</strong> (Servicio Nacional del Consumidor) para orientación sobre
                                    tus derechos como consumidor en materia de protección de datos personales.
                                </p>
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