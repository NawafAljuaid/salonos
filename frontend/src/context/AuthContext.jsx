import { createContext, useState } from 'react'
import { authService } from '../services/auth.service'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const storedUser = localStorage.getItem('user')
  const token = localStorage.getItem('token')

  const [user, setUser] = useState(
    storedUser && token ? JSON.parse(storedUser) : null
  )

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    return data
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
