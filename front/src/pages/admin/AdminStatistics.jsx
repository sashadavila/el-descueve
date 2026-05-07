export default function AdminStatistics() {
    return (
        <>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-primary">Análisis de Ventas</h2>
                    <p className="text-on-surface-variant">Métricas de rendimiento y seguimiento</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white border p-6">
                    <p className="text-sm uppercase text-slate-500">Ventas Totales</p>
                    <div className="text-2xl font-bold text-primary">$4,829,150</div>
                </div>
                <div className="bg-white border p-6">
                    <p className="text-sm uppercase text-slate-500">Tasa de Conversión</p>
                    <div className="text-2xl font-bold text-primary">4.28%</div>
                </div>
                <div className="bg-white border p-6">
                    <p className="text-sm uppercase text-slate-500">Valor Promedio por Pedido</p>
                    <div className="text-2xl font-bold text-primary">$342.50</div>
                </div>
                <div className="bg-white border p-6">
                    <p className="text-sm uppercase text-slate-500">Valor por Cliente (LTV)</p>
                    <div className="text-2xl font-bold text-primary">$1,850</div>
                </div>
            </div>

            <div className="bg-white border p-6">
                <h3 className="font-bold text-primary mb-4">Distribución por Categoría</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span>Línea Corporativa</span>
                        <span className="font-bold">42%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Línea Industrial</span>
                        <span className="font-bold">28%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Prendas con Bordado</span>
                        <span className="font-bold">18%</span>
                    </div>
                </div>
            </div>
        </>
    )
}