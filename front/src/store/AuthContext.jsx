import { createContext, useState, useEffect } from 'react'
import api from '../config/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const storedToken = localStorage.getItem('access_token')
        const storedUser = localStorage.getItem('user')

        if (storedToken && storedUser) {
            //  Verificar token con backend
            verifyToken(storedToken)
        } else {
            setLoading(false)
        }
    }, [])

    const verifyToken = async (token) => {
        try {
            const response = await fetch('http://localhost:3000/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const storedUser = localStorage.getItem('user')
                setUser(JSON.parse(storedUser))
                setIsAuthenticated(true)
            } else {
                // Token inválido, limpiar
                localStorage.removeItem('access_token')
                localStorage.removeItem('user')
            }
        } catch (error) {
            console.error('Token verification error:', error)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
            const response = await api.auth.login(email, password)

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

    const signup = async (userData) => {
        try {
            const response = await api.auth.register({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                phone: userData.phone,
                company: userData.company,
                rut: userData.rut,
                role: 'client',
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