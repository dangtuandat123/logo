import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Kiểm tra token đã lưu khi app load
        const token = localStorage.getItem('auth_token')
        const savedUser = localStorage.getItem('user')
        if (token && savedUser) {
            setUser(JSON.parse(savedUser))
            // Verify token vẫn còn valid
            api.get('/auth/me')
                .then(res => {
                    setUser(res.data.data.user)
                    localStorage.setItem('user', JSON.stringify(res.data.data.user))
                })
                .catch(() => {
                    localStorage.removeItem('auth_token')
                    localStorage.removeItem('user')
                    setUser(null)
                })
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password })
        const { user, token } = res.data.data
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
        return user
    }

    const register = async (name, email, password, password_confirmation) => {
        const res = await api.post('/auth/register', { name, email, password, password_confirmation })
        const { user, token } = res.data.data
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
        return user
    }

    const logout = async () => {
        try {
            await api.post('/auth/logout')
        } catch (e) { /* ignore */ }
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        setUser(null)
    }

    const refreshUser = async () => {
        try {
            const res = await api.get('/auth/me')
            setUser(res.data.data.user)
            localStorage.setItem('user', JSON.stringify(res.data.data.user))
        } catch (e) { /* ignore */ }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
