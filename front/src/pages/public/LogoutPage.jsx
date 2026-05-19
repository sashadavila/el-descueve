import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function LogoutPage() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        // Ejecutar logout
        logout();

        // Contador para redirección
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [logout, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
            <div className="text-center max-w-md mx-auto p-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-5xl text-green-600">check_circle</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Sesión cerrada!</h2>
                <p className="text-gray-600 mb-4">
                    Has cerrado sesión exitosamente. Gracias por visitarnos.
                </p>
                <div className="mt-6">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-[#FC9430] h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${(countdown / 3) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                        Redirigiendo al inicio de sesión en {countdown} segundos...
                    </p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="mt-6 text-[#FC9430] hover:text-[#e0852b] font-medium transition-colors"
                >
                    Ir ahora →
                </button>
            </div>
        </div>
    );
}