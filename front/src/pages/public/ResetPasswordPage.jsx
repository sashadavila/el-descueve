import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../../components/ui/Icon'
import api from '../../config/api'

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [token, setToken] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const tokenParam = searchParams.get('token')
        if (tokenParam) {
            setToken(tokenParam)
        } else {
            setError('Token inválido o faltante')
        }
    }, [searchParams])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return
        }

        setLoading(true)
        setError('')

        try {
            await api.auth.resetPassword(token, newPassword)
            setSuccess(true)
            setTimeout(() => {
                navigate('/login')
            }, 3000)
        } catch (err) {
            setError(err.message || 'Error al restablecer la contraseña')
        } finally {
            setLoading(false)
        }
    }

    if (!token && !error) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-500">Validando token...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl border-t-4 border-[#FC9430]">
                <div className="text-center">
                    <div className="text-3xl font-black text-[#163C7A] mb-4">EL DESCUEVEE</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Restablecer contraseña</h2>
                    <p className="text-sm text-gray-600">
                        Ingresa tu nueva contraseña
                    </p>
                </div>

                {success ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="check_circle" className="text-4xl text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">¡Contraseña actualizada!</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Tu contraseña ha sido actualizada correctamente.
                            Serás redirigido al inicio de sesión...
                        </p>
                        <Link
                            to="/login"
                            className="inline-block bg-[#FC9430] text-white px-6 py-3 font-bold uppercase rounded-lg hover:bg-[#e0852b] transition-colors"
                        >
                            Ir al inicio de sesión
                        </Link>
                    </div>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <div className="flex items-center">
                                    <Icon name="error" className="text-red-500 mr-2" />
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                Nueva Contraseña
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <Icon name="lock" className="text-gray-400" />
                                </span>
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-12 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FC9430] focus:border-transparent"
                                    placeholder="Mínimo 6 caracteres"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                Confirmar Contraseña
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <Icon name="lock" className="text-gray-400" />
                                </span>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-12 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FC9430] focus:border-transparent"
                                    placeholder="Repite tu nueva contraseña"
                                />
                            </div>
                        </div>

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
                                    Restableciendo...
                                </div>
                            ) : (
                                'Restablecer Contraseña'
                            )}
                        </button>

                        <div className="text-center">
                            <Link to="/login" className="text-sm text-[#FC9430] hover:text-[#e0852b] transition-colors">
                                ← Volver al inicio de sesión
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}