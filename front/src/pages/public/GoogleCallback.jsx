import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function GoogleCallback() {
    const navigate = useNavigate();
    const { setUserFromGoogle } = useAuth();
    const [error, setError] = useState('');
    const [status, setStatus] = useState('Procesando autenticación...');

    useEffect(() => {
        const processGoogleLogin = async () => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get('token');
                const userStr = urlParams.get('user');

                if (!token || !userStr) {
                    setError('No se recibieron credenciales válidas');
                    setStatus('Error de autenticación');
                    setTimeout(() => navigate('/'), 2000);
                    return;
                }

                setStatus('Guardando credenciales...');
                const user = JSON.parse(decodeURIComponent(userStr));

                localStorage.setItem('access_token', token);
                localStorage.setItem('user', JSON.stringify(user));

                setStatus('Actualizando sesión...');
                setUserFromGoogle(user);

                setStatus('¡Bienvenido! Redirigiendo...');
                setTimeout(() => {
                    navigate('/', { replace: true });
                }, 1500);

            } catch (err) {
                console.error('Error en callback de Google:', err);
                setError('Error al procesar el inicio de sesión');
                setStatus('Error, redirigiendo...');
                setTimeout(() => navigate('/login'), 2000);
            }
        };

        processGoogleLogin();
    }, [navigate, setUserFromGoogle]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
            <div className="text-center max-w-md mx-auto p-8">
                {error ? (
                    <>
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <span className="material-symbols-outlined text-5xl text-red-600">error</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Error al iniciar sesión</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <p className="text-sm text-gray-500">{status}</p>
                    </>
                ) : (
                    <>
                        <div className="relative w-24 h-24 mx-auto mb-6">
                            <div className="animate-spin rounded-full h-24 w-24 border-b-4 border-[#FC9430]"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl text-[#FC9430]">google</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Iniciando sesión con Google</h2>
                        <p className="text-gray-600 mb-2">{status}</p>
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-[#FC9430] h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}