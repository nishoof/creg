"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type AuthContextType = {
  username: string | null
  login: (username: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const storedUsername = localStorage.getItem("currentUser")
    if (storedUsername) {
      setUsername(storedUsername)
      setIsAuthenticated(true)
    }
  }, [])

  const login = (username: string) => {
    localStorage.setItem("currentUser", username)
    setUsername(username)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("currentUser")
    setUsername(null)
    setIsAuthenticated(false)
  }

  return <AuthContext.Provider value={{ username, login, logout, isAuthenticated }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

