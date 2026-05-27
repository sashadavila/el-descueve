const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    console.log('🔑 [API] getAuthHeaders - Token existe:', !!token);
    if (token) {
        console.log('🔑 [API] Token (primeros 50 chars):', token.substring(0, 50) + '...');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }
    return { 'Content-Type': 'application/json' };
};

export const api = {
    auth: {
        login: async (email, password) => {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error en login');
            return data;
        },

        register: async (userData) => {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error en registro');
            return data;
        },

        googleLogin: () => {
            window.location.href = `${API_BASE_URL}/auth/google`;
        },

        forgotPassword: async (email) => {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al enviar email');
            return data;
        },

        resetPassword: async (token, newPassword) => {
            const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al resetear contraseña');
            return data;
        },

        getProfile: async () => {
            const headers = getAuthHeaders();
            console.log('🔑 [API] getProfile - Headers enviados:', headers);

            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'GET',
                headers: headers,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al obtener perfil');
            return data;
        },
    },

    admin: {
        getAllUsers: async () => {
            const headers = getAuthHeaders();
            console.log('🔑 [API] getAllUsers - Headers:', headers);

            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'GET',
                headers: headers,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al obtener usuarios');
            return data;
        },

        getUserById: async (id) => {
            const headers = getAuthHeaders();
            const response = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'GET',
                headers: headers,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al obtener usuario');
            return data;
        },

        updateUser: async (id, userData) => {
            const headers = getAuthHeaders();
            const response = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al actualizar usuario');
            return data;
        },

        getUserStats: async () => {
            const headers = getAuthHeaders();
            console.log('🔑 [API] getUserStats - URL:', `${API_BASE_URL}/users/stats/summary`);
            console.log('🔑 [API] getUserStats - Headers:', headers);

            const response = await fetch(`${API_BASE_URL}/users/stats/summary`, {
                method: 'GET',
                headers: headers,
            });

            console.log('🔑 [API] getUserStats - Response status:', response.status);

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al obtener estadísticas');
            return data;
        },
    },
};

export default api;