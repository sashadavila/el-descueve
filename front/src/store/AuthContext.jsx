import { createContext, useState, useEffect } from 'react'
import api from '../config/api'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('access_token')
            const storedUser = localStorage.getItem('user')

            if (storedToken && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser)
                    setUser(parsedUser)
                    setIsAuthenticated(true)

                    // Verificar si el token sigue siendo válido
                    try {
                        const profile = await api.auth.getProfile()
                        setUser(profile)
                        localStorage.setItem('user', JSON.stringify(profile))
                    } catch (error) {
                        console.error('Token inválido, cerrando sesión')
                        logout()
                    }
                } catch (error) {
                    console.error('Error parsing stored user:', error)
                    localStorage.removeItem('access_token')
                    localStorage.removeItem('user')
                }
            }
            setLoading(false)
        }

        checkAuth()
    }, [])

    const setUserFromGoogle = (googleUser) => {
        setUser(googleUser)
        setIsAuthenticated(true)
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

    // Verificar si el usuario es admin
    const isAdmin = () => {
        return user?.role === 'admin'
    }

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            signup,
            logout,
            setUserFromGoogle,
            isAdmin: isAdmin()
        }}>
            {children}
        </AuthContext.Provider>
    )
}