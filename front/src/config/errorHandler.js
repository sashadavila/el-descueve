// src/config/errorHandler.js (nuevo archivo)
export const handleApiError = (error, context = 'API') => {
    console.error(`[${context}] Error:`, error)

    if (!navigator.onLine) {
        return {
            message: 'No hay conexión a internet. Verifica tu red.',
            type: 'offline'
        }
    }

    if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
        return {
            message: 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.',
            type: 'connection'
        }
    }

    if (error.response?.status === 401) {
        return {
            message: 'Sesión expirada. Por favor, inicia sesión nuevamente.',
            type: 'unauthorized'
        }
    }

    if (error.response?.status === 404) {
        return {
            message: 'El recurso solicitado no existe.',
            type: 'not_found'
        }
    }

    return {
        message: error.message || 'Error desconocido',
        type: 'unknown'
    }
}

export const showErrorToast = (error, context) => {
    const handled = handleApiError(error, context)
    // Puedes implementar un toast notification aquí
    console.warn(`[${context}] ${handled.message}`)
    return handled
}