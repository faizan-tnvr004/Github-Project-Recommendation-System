import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

function readStored(key) {
  try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStored('prs_user'))
  const [token, setToken] = useState(() => localStorage.getItem('prs_token') || null)

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('prs_user', JSON.stringify(userData))
    localStorage.setItem('prs_token', authToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('prs_user')
    localStorage.removeItem('prs_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
