// src/pages/admin/zones/inventory/AdminInventoryDirectory.jsx
import { useState, useEffect, useRef } from 'react'
import Icon from '../../../../components/ui/Icon'
import api from '../../../../config/api'

export default function AdminInventoryDirectory() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalProducts, setTotalProducts] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [showImportModal, setShowImportModal] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [uploadResult, setUploadResult] = useState(null)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)

    const itemsPerPage = 15

    const loadProducts = async () => {
        setLoading(true)
        try {
            const filters = { page: currentPage, limit: itemsPerPage }
            if (searchTerm) filters.search = searchTerm
            if (filterType !== 'all') filters.productType = filterType

            const response = await api.products.getAll(currentPage, itemsPerPage, filters)
            setProducts(response.data || [])
            setTotalPages(response.totalPages || 1)
            setTotalProducts(response.total || 0)
        } catch (err) {
            console.error('Error loading products:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadProducts()
    }, [currentPage, filterType])

    useEffect(() => {
        const timeout = setTimeout(() => {
            setCurrentPage(1)
            loadProducts()
        }, 500)
        return () => clearTimeout(timeout)
    }, [searchTerm])

    const handleEdit = (product) => {
        setEditingProduct(product)
        setShowModal(true)
    }

    const handleDelete = async (id, name) => {
        if (!confirm(`¿Estás seguro de eliminar "${name}"? Esta acción no se puede deshacer.`)) {
            return
        }

        setDeletingId(id)
        try {
            await api.products.delete(id)
            await loadProducts()
            alert('✅ Producto eliminado correctamente')
        } catch (err) {
            console.error('Error deleting product:', err)
            alert('❌ Error al eliminar producto: ' + err.message)
        } finally {
            setDeletingId(null)
        }
    }

    const handleImport = async () => {
        if (!selectedFile) {
            alert('Por favor, selecciona un archivo Excel')
            return
        }

        setUploading(true)
        setUploadResult(null)

        try {
            const result = await api.products.importExcel(selectedFile)
            setUploadResult({
                success: true,
                imported: result.imported || 0,
                updated: result.updated || 0,
                errors: result.errors || [],
                total: result.total || 0
            })
            await loadProducts()
            setSelectedFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ''
            setTimeout(() => setUploadResult(null), 5000)
        } catch (err) {
            setUploadResult({
                success: false,
                message: err.message || 'Error al importar productos'
            })
        } finally {
            setUploading(false)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
            if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/)) {
                alert('Selecciona un archivo Excel válido (.xlsx o .xls)')
                if (fileInputRef.current) fileInputRef.current.value = ''
                return
            }
            setSelectedFile(file)
        }
    }

    const getProductTypeLabel = (type) => {
        const labels = {
            corporativo: 'Corporativo',
            industrial: 'Industrial',
            bordados: 'Bordados',
            equipos: 'Equipos'
        }
        return labels[type] || type || 'Desconocido'
    }

    const getProductTypeColor = (type) => {
        const colors = {
            corporativo: 'bg-blue-100 text-blue-700',
            industrial: 'bg-orange-100 text-orange-700',
            bordados: 'bg-purple-100 text-purple-700',
            equipos: 'bg-green-100 text-green-700'
        }
        return colors[type] || 'bg-gray-100 text-gray-700'
    }

    const Pagination = () => {
        if (totalPages <= 1) return null

        const pages = []
        const maxVisible = 5
        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
        let endPage = Math.min(totalPages, startPage + maxVisible - 1)

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }

        return (
            <div className="flex justify-center items-center gap-2 mt-6">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Anterior
                </button>
                {startPage > 1 && (
                    <>
                        <button onClick={() => setCurrentPage(1)} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">1</button>
                        {startPage > 2 && <span className="px-2">...</span>}
                    </>
                )}
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 text-sm border rounded-lg ${currentPage === page ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}
                    >
                        {page}
                    </button>
                ))}
                {endPage < totalPages && (
                    <>
                        {endPage < totalPages - 1 && <span className="px-2">...</span>}
                        <button onClick={() => setCurrentPage(totalPages)} className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">{totalPages}</button>
                    </>
                )}
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Siguiente
                </button>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-primary flex items-center gap-3">
                            <Icon name="inventory_2" className="text-4xl" />
                            Directorio de Productos
                        </h2>
                        <p className="text-on-surface-variant mt-1">Gestión completa del catálogo de productos</p>
                    </div>
                    <button
                        onClick={() => setShowImportModal(true)}
                        className="bg-[#FC9430] text-white px-4 py-2 rounded-lg font-bold uppercase text-sm hover:bg-[#e0852b] transition-colors flex items-center gap-2"
                    >
                        <Icon name="upload_file" className="text-sm" />
                        Importar Excel
                    </button>
                </div>

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <Icon name="search" className="text-gray-400 text-sm" />
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar por nombre o referencia..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                    >
                        <option value="all">Todos los tipos</option>
                        <option value="corporativo">Corporativo</option>
                        <option value="industrial">Industrial</option>
                        <option value="bordados">Bordados</option>
                        <option value="equipos">Equipos</option>
                    </select>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Tabla de productos */}
                <div className="bg-white rounded-xl border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Imagen</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Producto</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Referencia</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Tipo</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Precio</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Stock</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Estado</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="text-center py-8 text-gray-500">
                                            No se encontraron productos
                                        </td>
                                    </tr>
                                ) : (
                                    products.map(product => (
                                        <tr key={product.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <img
                                                    src={product.imageUrl || 'https://via.placeholder.com/50'}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/50' }}
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium">{product.name}</div>
                                                <div className="text-xs text-gray-500">{product.subcategory || '-'}</div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">{product.reference}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-1 rounded-full ${getProductTypeColor(product.productType)}`}>
                                                    {getProductTypeLabel(product.productType)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-bold text-primary">${(product.price || 0).toLocaleString()}</td>
                                            <td className="px-4 py-3">
                                                <span className={product.stock === 0 ? 'text-red-600 font-bold' : product.stock < 10 ? 'text-yellow-600' : 'text-green-600'}>
                                                    {product.stock || 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {product.isActive ? (
                                                    <span className="text-green-600 text-sm">Activo</span>
                                                ) : (
                                                    <span className="text-red-600 text-sm">Inactivo</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="text-primary hover:text-[#FC9430] transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Icon name="edit" className="text-sm" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        disabled={deletingId === product.id}
                                                        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                                                        title="Eliminar"
                                                    >
                                                        {deletingId === product.id ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                                        ) : (
                                                            <Icon name="delete" className="text-sm" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Paginación */}
                <Pagination />

                <div className="text-sm text-gray-500">
                    Total de productos: {totalProducts}
                </div>
            </div>

            {/* Modal de Importación */}
            {showImportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-primary">Importar productos desde Excel</h3>
                            <button onClick={() => {
                                setShowImportModal(false)
                                setUploadResult(null)
                                setSelectedFile(null)
                            }} className="text-gray-400 hover:text-gray-600">
                                <Icon name="close" className="text-2xl" />
                            </button>
                        </div>

                        <div className="p-6">
                            {uploadResult ? (
                                <div className={`p-4 rounded-lg ${uploadResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
                                    {uploadResult.success ? (
                                        <>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Icon name="check_circle" className="text-green-500 text-2xl" />
                                                <h4 className="font-bold text-green-700">Importación completada</h4>
                                            </div>
                                            <p className="text-sm text-green-600">
                                                ✅ {uploadResult.imported} productos nuevos importados<br />
                                                🔄 {uploadResult.updated} productos actualizados<br />
                                                📊 Total procesados: {uploadResult.total}<br />
                                                {uploadResult.errors.length > 0 && (
                                                    <>⚠️ {uploadResult.errors.length} errores encontrados</>
                                                )}
                                            </p>
                                            {uploadResult.errors.length > 0 && (
                                                <details className="mt-3">
                                                    <summary className="text-sm text-red-600 cursor-pointer">Ver errores</summary>
                                                    <ul className="mt-2 text-xs text-red-500 list-disc pl-4">
                                                        {uploadResult.errors.slice(0, 10).map((err, i) => (
                                                            <li key={i}>{err}</li>
                                                        ))}
                                                    </ul>
                                                </details>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setShowImportModal(false)
                                                    setUploadResult(null)
                                                    setSelectedFile(null)
                                                }}
                                                className="mt-4 w-full bg-primary text-white px-4 py-2 rounded-lg font-medium"
                                            >
                                                Cerrar
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-2 mb-3">
                                                <Icon name="error" className="text-red-500 text-2xl" />
                                                <h4 className="font-bold text-red-700">Error en la importación</h4>
                                            </div>
                                            <p className="text-sm text-red-600">{uploadResult.message}</p>
                                            <button
                                                onClick={() => setUploadResult(null)}
                                                className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded-lg font-medium"
                                            >
                                                Reintentar
                                            </button>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                                        <Icon name="cloud_upload" className="text-5xl text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-600 mb-2">Selecciona un archivo Excel (.xlsx, .xls)</p>
                                        <p className="text-xs text-gray-400">Máximo 10MB</p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".xlsx,.xls"
                                            onChange={handleFileChange}
                                            className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
                                        />
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                        <h4 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                                            <Icon name="info" className="text-sm" />
                                            Columnas soportadas
                                        </h4>
                                        <p className="text-xs text-blue-600">Requeridas: <strong>name, reference, price</strong></p>
                                        <p className="text-xs text-blue-600">Opcionales: description, productType, category, sizes, colors, stock, imageUrl, isFeatured, discount, features</p>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                setShowImportModal(false)
                                                setSelectedFile(null)
                                            }}
                                            className="flex-1 px-4 py-2 border rounded-lg font-medium"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleImport}
                                            disabled={!selectedFile || uploading}
                                            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {uploading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    Importando...
                                                </>
                                            ) : (
                                                'Importar productos'
                                            )}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}