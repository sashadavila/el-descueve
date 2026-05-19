import { createContext, useState, useEffect } from 'react'
import api from '../config/api'  // ✅ IMPORTAR API

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Verificar si hay token y usuario en localStorage
        const storedToken = localStorage.getItem('access_token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser))
            setIsAuthenticated(true)
        }
        setLoading(false)
    }, [])

    // ✅ LOGIN CONECTADO AL BACKEND
    const login = async (email, password) => {
        try {
            const response = await api.auth.login(email, password)

            // Guardar token y usuario
            localStorage.setItem('access_token', response.access_token)
            localStorage.setItem('user', JSON.stringify(response.user))

            setUser(response.user)
            setIsAuthenticated(true)

            return response
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    }

    // ✅ REGISTER CONECTADO AL BACKEND
    const signup = async (userData) => {
        try {
            const response = await api.auth.register({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                role: 'client', // Rol por defecto
            })

            return response
        } catch (error) {
            console.error('Signup error:', error)
            throw error
        }
    }

    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            signup,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}