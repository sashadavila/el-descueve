import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        rut: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const { signup } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Nombre completo es requerido'
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email es requerido'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido'
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Teléfono es requerido'
        }
        if (!formData.company.trim()) {
            newErrors.company = 'Nombre de empresa es requerido'
        }
        if (!formData.rut.trim()) {
            newErrors.rut = 'RUT es requerido'
        }
        if (!formData.password) {
            newErrors.password = 'Contraseña es requerida'
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden'
        }
        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'Debes aceptar los términos y condiciones'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            await signup({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                company: formData.company,
                rut: formData.rut,
            })
            navigate('/login')
        } catch (err) {
            if (err.message === 'El email ya está registrado') {
                setErrors({ email: 'Este email ya está registrado' })
            } else {
                setErrors({ submit: err.message || 'Error al crear la cuenta' })
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white p-8 rounded-xl shadow-2xl border-t-4 border-[#FC9430]">
                    {/* Logo y título */}
                    <div className="text-center mb-8">
                        <div className="text-3xl font-black text-[#163C7A] mb-4">EL DESCUVEE</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Crear Cuenta Corporativa</h2>
                        <p className="text-sm text-gray-600">Regístrate para cotizar y comprar ropa corporativa</p>
                    </div>

                    {/* Error general */}
                    {errors.submit && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <p className="text-sm text-red-700">{errors.submit}</p>
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre completo */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                    Nombre Completo *
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <span className="material-symbols-outlined text-gray-400 text-xl">person</span>
                                    </span>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-12 border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FC9430] focus:border-transparent`}
                                        placeholder="Juan Pérez"
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            {/* RUT */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                    RUT *
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <span className="material-symbols-outlined text-gray-400 text-xl">assignment_ind</span>
                                    </span>
                                    <input
                                        type="text"
                                        name="rut"
                                        value={formData.rut}
                                        onChange={handleChange}
                                        className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-12 border ${errors.rut ? 'border-red-500' : 'border-gray-300'
                                            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FC9430] focus:border-transparent`}
                                        placeholder="12.345.678-9"
                                    />
                                </div>
                                {errors.rut && <p className="mt-1 text-xs text-red-500">{errors.rut}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                    Email Corporativo *
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <span className="material-symbols-outlined text-gray-400 text-xl">mail</span>
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-12 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FC9430] focus:border-transparent`}
                                        placeholder="ejecutivo@empresa.cl"
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                    Teléfono / WhatsApp *
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <span className="material-symbols-outlined text-gray-400 text-xl">phone</span>
                                    </span>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-12 border ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FC9430] focus:border-transparent`}
                                        placeholder="+56 9 1234 5678"
                                    />
                                </div>
                                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                            </div>

                            {/* Empresa */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                    Nombre de la Empresa *
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <span className="material-symbols-outlined text-gray-400 text-xl">business</span>
                                    </span>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-12 border ${errors.company ? 'border-red-500' : 'border-gray-300'
                                            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FC9430] focus:border-transparent`}
                                        placeholder="Mi Empresa S.A."
                                    />
                                </div>
                                {errors.company && <p className="mt-1 text-xs text-red-500">{errors.company}</p>}
                            </div>

                            {/* Contraseña */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                    Contraseña *
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <span className="material-symbols-outlined text-gray-400 text-xl">lock</span>
                                    </span>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-12 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FC9430] focus:border-transparent`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                            </div>

                            {/* Confirmar contraseña */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                    Confirmar Contraseña *
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                        <span className="material-symbols-outlined text-gray-400 text-xl">lock</span>
                                    </span>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`appearance-none rounded-lg relative block w-full px-3 py-3 pl-12 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FC9430] focus:border-transparent`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        {/* Términos y condiciones */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="acceptTerms"
                                    name="acceptTerms"
                                    type="checkbox"
                                    checked={formData.acceptTerms}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-[#FC9430] focus:ring-[#FC9430] border-gray-300 rounded"
                                />
                            </div>
                            <div className="ml-3">
                                <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                                    Acepto los{' '}
                                    <a href="#" className="text-[#FC9430] hover:text-[#e0852b] font-medium">
                                        Términos y Condiciones
                                    </a>{' '}
                                    y la{' '}
                                    <a href="#" className="text-[#FC9430] hover:text-[#e0852b] font-medium">
                                        Política de Privacidad
                                    </a>
                                </label>
                                {errors.acceptTerms && <p className="mt-1 text-xs text-red-500">{errors.acceptTerms}</p>}
                            </div>
                        </div>

                        {/* Botón de registro */}
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-wider rounded-lg text-white bg-[#FC9430] hover:bg-[#e0852b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC9430] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Creando cuenta...
                                    </div>
                                ) : (
                                    'Crear Cuenta Corporativa'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Separador */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">O regístrate con</span>
                        </div>
                    </div>

                    {/* Botones de proveedores */}
                    <div className="grid grid-cols-1 gap-3 max-w-xs mx-auto">
                        <button
                            onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/google`}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="text-sm font-medium">Continuar con Google</span>
                        </button>
                    </div>

                    {/* Link a login */}
                    <p className="text-center text-sm text-gray-600 mt-6">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="font-medium text-[#FC9430] hover:text-[#e0852b] transition-colors">
                            Inicia sesión aquí
                        </Link>
                    </p>

                    {/* Información adicional */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div>
                                <span className="material-symbols-outlined text-[#FC9430] text-xl">local_laundry_service</span>
                                <p className="text-xs text-gray-500 mt-1">Bordado profesional incluido</p>
                            </div>
                            <div>
                                <span className="material-symbols-outlined text-[#FC9430] text-xl">groups</span>
                                <p className="text-xs text-gray-500 mt-1">Pedido mínimo 10 unidades</p>
                            </div>
                            <div>
                                <span className="material-symbols-outlined text-[#FC9430] text-xl">local_shipping</span>
                                <p className="text-xs text-gray-500 mt-1">Atención La Serena - Calbuco</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}