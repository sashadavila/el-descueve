import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Verificar si hay usuario en localStorage
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
            setIsAuthenticated(true)
        }
        setLoading(false)
    }, [])

    const login = async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email && password) {
                    const user = {
                        id: 1,
                        name: email.split('@')[0],
                        email: email,
                        role: email.includes('admin') ? 'admin' : 'user'
                    }
                    setUser(user)
                    setIsAuthenticated(true)
                    localStorage.setItem('user', JSON.stringify(user))
                    resolve(user)
                } else {
                    reject(new Error('Credenciales inválidas'))
                }
            }, 1000)
        })
    }

    const signup = async (userData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (userData.email && userData.password) {
                    const newUser = {
                        id: Date.now(),
                        name: userData.name,
                        email: userData.email,
                        phone: userData.phone,
                        company: userData.company,
                        rut: userData.rut,
                        role: 'user'
                    }
                    resolve(newUser)
                } else {
                    reject(new Error('Error al crear la cuenta'))
                }
            }, 1000)
        })
    }

    const logout = () => {
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    )
}