import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../config/api'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    // Obtener la página de redirección si existe (desde protected routes)
    const from = location.state?.from?.pathname || '/'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccessMessage('')
        setLoading(true)

        try {
            const response = await login(email, password)

            // Mostrar mensaje del backend (incluye info del email de alerta)
            if (response?.message) {
                setSuccessMessage(response.message)
            } else {
                setSuccessMessage('✅ Inicio de sesión exitoso. Redirigiendo...')
            }

            // Guardar email si "Recordarme" está marcado
            if (rememberMe) {
                localStorage.setItem('remembered_email', email)
            } else {
                localStorage.removeItem('remembered_email')
            }

            // Esperar 2 segundos para mostrar el mensaje antes de redirigir
            setTimeout(() => {
                navigate(from, { replace: true })
            }, 2000)

        } catch (err) {
            let errorMessage = 'Error al iniciar sesión'

            // Manejar errores específicos del backend
            if (err.message === 'Credenciales inválidas') {
                errorMessage = '❌ Email o contraseña incorrectos. Por favor, verifica tus credenciales.'
            } else if (err.message === 'Esta cuenta fue creada con Google. Inicia sesión con Google') {
                errorMessage = '🔐 Esta cuenta fue creada con Google. Por favor, inicia sesión usando el botón de Google.'
            } else if (err.message.includes('email')) {
                errorMessage = '📧 Por favor, ingresa un email válido.'
            } else if (err.message) {
                errorMessage = err.message
            }

            setError(errorMessage)
            setLoading(false)
        }
    }

    const handleGoogleLogin = () => {
        setLoading(true)
        setError('')
        api.auth.googleLogin()
        // Nota: La redirección la maneja GoogleCallback
    }

    // Cargar email guardado de "Recordarme"
    useState(() => {
        const rememberedEmail = localStorage.getItem('remembered_email')
        if (rememberedEmail) {
            setEmail(rememberedEmail)
            setRememberMe(true)
        }
    }, [])

    // Pantalla de carga mientras se procesa el login
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
                <div className="text-center max-w-md mx-auto p-8">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-[#FC9430]"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-[#FC9430]">login</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Iniciando sesión</h2>
                    <p className="text-gray-600 mb-2">Por favor espera un momento...</p>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-[#FC9430] h-1.5 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">Verificando credenciales y enviando alerta de seguridad</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-white">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl border-t-4 border-[#FC9430]">
                <div className="text-center">
                    <div className="text-3xl font-black text-[#163C7A] mb-4">EL DESCUEVEE</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
                    <p className="text-sm text-gray-600">Accede a tu cuenta corporativa</p>
                </div>

                {/* Mensaje de éxito */}
                {successMessage && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded animate-fade-in-up">
                        <div className="flex items-center">
                            <span className="material-symbols-outlined text-green-500 mr-2">check_circle</span>
                            <p className="text-sm text-green-700">{successMessage}</p>
                        </div>
                    </div>
                )}

                {/* Mensaje de error */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded animate-fade-in-up">
                        <div className="flex items-start">
                            <span className="material-symbols-outlined text-red-500 mr-2 mt-0.5">error</span>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <span className="material-symbols-outlined text-gray-400 text-xl">mail</span>
                                </span>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-12 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FC9430] focus:border-transparent"
                                    placeholder="ejecutivo@empresa.cl"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                Contraseña
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <span className="material-symbols-outlined text-gray-400 text-xl">lock</span>
                                </span>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-12 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FC9430] focus:border-transparent"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-[#FC9430] focus:ring-[#FC9430] border-gray-300 rounded cursor-pointer"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                                Recordarme
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-[#FC9430] hover:text-[#e0852b] transition-colors">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-wider rounded-lg text-white bg-[#FC9430] hover:bg-[#e0852b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC9430] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Iniciar Sesión
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">O continúa con</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="text-sm font-medium">Continuar con Google</span>
                </button>

                <p className="text-center text-sm text-gray-600">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/signup" className="font-medium text-[#FC9430] hover:text-[#e0852b] transition-colors">
                        Regístrate aquí
                    </Link>
                </p>

                {/* Información de seguridad */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">security</span>
                            <span>Conexión segura</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">mail</span>
                            <span>Recibirás alerta de seguridad</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}