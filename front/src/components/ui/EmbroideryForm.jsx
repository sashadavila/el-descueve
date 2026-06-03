// src/components/ui/EmbroideryForm.jsx
import { useState, useRef } from 'react'
import Icon from './Icon'

const EMBROIDERY_POSITIONS = [
    { value: 'Pecho izquierdo', label: 'Pecho izquierdo', icon: 'circle' },
    { value: 'Pecho derecho', label: 'Pecho derecho', icon: 'circle' },
    { value: 'Manga izquierda', label: 'Manga izquierda', icon: 'straighten' },
    { value: 'Manga derecha', label: 'Manga derecha', icon: 'straighten' },
    { value: 'Espalda', label: 'Espalda', icon: 'crop_portrait' },
    { value: 'Cuello', label: 'Cuello', icon: 'checkroom' },
    { value: 'Caperuza', label: 'Caperuza', icon: 'hood' },
]

export default function EmbroideryForm({ product, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        maxStitches: product?.embroidery?.maxStitches || 15000,
        colors: product?.embroidery?.colors || 6,
        positions: product?.embroidery?.positions || ['Pecho izquierdo'],
        specialInstructions: '',
    })
    const [selectedFile, setSelectedFile] = useState(null)
    const [filePreview, setFilePreview] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const fileInputRef = useRef(null)

    const handlePositionToggle = (position) => {
        setFormData(prev => {
            if (prev.positions.includes(position)) {
                return { ...prev, positions: prev.positions.filter(p => p !== position) }
            } else {
                return { ...prev, positions: [...prev.positions, position] }
            }
        })
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'application/pdf']
            if (!allowedTypes.includes(file.type)) {
                setError('Formato no permitido. Use JPG, PNG, SVG o PDF')
                return
            }
            if (file.size > 5 * 1024 * 1024) {
                setError('El archivo no puede superar los 5MB')
                return
            }

            setSelectedFile(file)
            setError(null)

            if (file.type.startsWith('image/')) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setFilePreview(reader.result)
                }
                reader.readAsDataURL(file)
            } else {
                setFilePreview(null)
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!selectedFile) {
            setError('Debes subir el archivo de tu logo')
            return
        }

        if (formData.positions.length === 0) {
            setError('Debes seleccionar al menos una posición para el bordado')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const reader = new FileReader()

            reader.onloadend = () => {
                const embroideryRequest = {
                    productId: product.id,
                    productName: product.name,
                    productReference: product.reference,
                    maxStitches: formData.maxStitches,
                    colors: formData.colors,
                    positions: formData.positions,
                    specialInstructions: formData.specialInstructions,
                    logoData: reader.result,
                    logoFilename: selectedFile.name,
                    logoSize: selectedFile.size,
                    logoType: selectedFile.type,
                    createdAt: new Date().toISOString(),
                }

                onSuccess(embroideryRequest)
            }

            reader.readAsDataURL(selectedFile)

        } catch (err) {
            console.error('Error processing embroidery:', err)
            setError(err.message || 'Error al procesar la solicitud')
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-primary mb-2 uppercase">
                    Máximo de puntadas
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="5000"
                        max="50000"
                        step="1000"
                        value={formData.maxStitches}
                        onChange={(e) => setFormData({ ...formData, maxStitches: parseInt(e.target.value) })}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FC9430]"
                    />
                    <span className="text-lg font-bold text-[#FC9430] min-w-[100px] text-right">
                        {formData.maxStitches.toLocaleString()}
                    </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Mínimo 5,000 - Máximo 50,000 puntadas</p>
            </div>

            <div>
                <label className="block text-sm font-bold text-primary mb-2 uppercase">
                    Número de colores
                </label>
                <div className="flex items-center gap-4">
                    <input
                        type="range"
                        min="1"
                        max="12"
                        step="1"
                        value={formData.colors}
                        onChange={(e) => setFormData({ ...formData, colors: parseInt(e.target.value) })}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FC9430]"
                    />
                    <span className="text-lg font-bold text-[#FC9430] min-w-[50px] text-right">
                        {formData.colors}
                    </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Hasta 12 colores por diseño</p>
            </div>

            <div>
                <label className="block text-sm font-bold text-primary mb-2 uppercase">
                    Posiciones del bordado
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {EMBROIDERY_POSITIONS.map(pos => (
                        <button
                            key={pos.value}
                            type="button"
                            onClick={() => handlePositionToggle(pos.value)}
                            className={`flex items-center gap-3 p-3 border-2 rounded-lg transition-all ${formData.positions.includes(pos.value)
                                    ? 'border-[#FC9430] bg-[#FC9430]/10 text-primary'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                }`}
                        >
                            <Icon name={pos.icon} className="text-sm" />
                            <span className="text-sm font-medium">{pos.label}</span>
                            {formData.positions.includes(pos.value) && (
                                <Icon name="check_circle" className="text-sm text-[#FC9430] ml-auto" />
                            )}
                        </button>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Selecciona una o más posiciones</p>
            </div>

            <div>
                <label className="block text-sm font-bold text-primary mb-2 uppercase">
                    Logo / Diseño *
                </label>
                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${selectedFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-primary'
                        }`}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.svg,.pdf"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {filePreview ? (
                        <div className="space-y-3">
                            <img src={filePreview} alt="Preview" className="max-h-32 mx-auto rounded" />
                            <p className="text-sm font-medium text-green-600">{selectedFile?.name}</p>
                            <p className="text-xs text-gray-500">{(selectedFile?.size / 1024).toFixed(2)} KB</p>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedFile(null)
                                    setFilePreview(null)
                                    if (fileInputRef.current) fileInputRef.current.value = ''
                                }}
                                className="text-xs text-red-500 hover:underline"
                            >
                                Eliminar
                            </button>
                        </div>
                    ) : (
                        <>
                            <Icon name="cloud_upload" className="text-4xl text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Haz clic para subir tu logo</p>
                            <p className="text-xs text-gray-400 mt-1">Formatos: JPG, PNG, SVG, PDF (max 5MB)</p>
                        </>
                    )}
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-primary mb-2 uppercase">
                    Instrucciones especiales (opcional)
                </label>
                <textarea
                    rows="3"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
                    placeholder="Ej: El logo debe ir en tamaño grande, prefiero colores corporativos azul y blanco..."
                />
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex items-center gap-2">
                        <Icon name="error" className="text-red-500" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            )}

            <div className="flex gap-4 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-bold uppercase rounded-lg hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#FC9430] text-white px-4 py-3 font-bold uppercase rounded-lg hover:bg-[#e0852b] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Procesando...
                        </>
                    ) : (
                        <>
                            <Icon name="send" className="text-sm" />
                            Agregar Bordado
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}