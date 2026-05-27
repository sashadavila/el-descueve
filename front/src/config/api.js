const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
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
            if (!response.ok) throw new Error(data.message);
            return data;
        },

        register: async (userData) => {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
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
            if (!response.ok) throw new Error(data.message);
            return data;
        },

        resetPassword: async (token, newPassword) => {
            const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        },

        getProfile: async () => {
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        },
    },

    admin: {
        getAllUsers: async () => {
            const response = await fetch(`${API_BASE_URL}/users`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        },

        getUserById: async (id) => {
            const response = await fetch(`${API_BASE_URL}/users/${id}`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        },

        updateUser: async (id, userData) => {
            const response = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'PUT',
                headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        },

        getUserStats: async () => {
            const response = await fetch(`${API_BASE_URL}/users/stats/summary`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);
            return data;
        },
    },
};

export default api;