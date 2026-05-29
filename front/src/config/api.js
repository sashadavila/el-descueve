// api.js - Versión corregida
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
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
        getProfile: async () => {
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al obtener perfil');
            return data;
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
            if (!response.ok) throw new Error(data.message || 'Error al restablecer contraseña');
            return data;
        },
        googleLogin: () => {
            window.location.href = `${API_BASE_URL}/auth/google`;
        },
    },

    admin: {
        getAllUsers: async () => {
            const response = await fetch(`${API_BASE_URL}/users`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al obtener usuarios');
            return data;
        },
        getUserById: async (id) => {
            const response = await fetch(`${API_BASE_URL}/users/${id}`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al obtener usuario');
            return data;
        },
        updateUser: async (id, userData) => {
            const response = await fetch(`${API_BASE_URL}/users/${id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al actualizar usuario');
            return data;
        },
        getUserStats: async () => {
            const response = await fetch(`${API_BASE_URL}/users/stats/summary`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al obtener estadísticas');
            return data;
        },
        getAllOrders: async () => {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al obtener órdenes');
            return data;
        },
    },

    notifications: {
        getAll: async (status = null, page = 1, limit = 10) => {
            let url = `${API_BASE_URL}/notifications?page=${page}&limit=${limit}`;
            if (status) {
                url += `&status=${status}`;
            }
            const response = await fetch(url, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al obtener notificaciones');
            return data;
        },
        getUnreadCount: async () => {
            const response = await fetch(`${API_BASE_URL}/notifications/unread/count`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al obtener contador');
            return data;
        },
        markAsRead: async (id) => {
            const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
                method: 'PUT',
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al marcar como leída');
            return data;
        },
        markAllAsRead: async () => {
            const response = await fetch(`${API_BASE_URL}/notifications/actions/mark-all-read`, {
                method: 'PUT',
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al marcar todas como leídas');
            return data;
        },
        delete: async (id) => {
            const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al eliminar notificación');
            return data;
        },
        generate: async (users) => {
            const response = await fetch(`${API_BASE_URL}/notifications/actions/generate`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ users }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al generar notificaciones');
            return data;
        },
    },

    // Productos:
    products: {
        getAll: async (page = 1, limit = 15, filters = {}) => {
            let url = `${API_BASE_URL}/products?page=${page}&limit=${limit}`;
            if (filters.productType) url += `&productType=${filters.productType}`;
            if (filters.categoryId) url += `&categoryId=${filters.categoryId}`;
            if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
            if (filters.sortBy) url += `&sortBy=${filters.sortBy}`;
            if (filters.sortOrder) url += `&sortOrder=${filters.sortOrder}`;

            const response = await fetch(url);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al obtener productos');
            return data;
        },

        getById: async (id) => {
            const response = await fetch(`${API_BASE_URL}/products/${id}`);
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al obtener producto');
            return data;
        },

        create: async (productData) => {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(productData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al crear producto');
            return data;
        },

        update: async (id, productData) => {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'PATCH',
                headers: getAuthHeaders(),
                body: JSON.stringify(productData),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al actualizar producto');
            return data;
        },

        delete: async (id) => {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al eliminar producto');
            return data;
        },

        importExcel: async (file) => {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_BASE_URL}/products/import/excel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: formData,
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al importar productos');
            return data;
        },

        getStats: async () => {
            const response = await fetch(`${API_BASE_URL}/products/stats`, {
                headers: getAuthHeaders(),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error al obtener estadísticas');
            return data;
        },
    },
};

export default api;