"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const response = await apiClient.get("/getuserdata")

      // Check if backend is not available
      if (response.status === 503 || !response.ok) {
        console.log("Backend not available - skipping auth check")
        setIsLoading(false)
        return
      }

      try {
        const userData = await response.json()
        setUser(userData)
      } catch (parseError) {
        console.warn("Failed to parse auth response")
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      // Don't throw error, just continue without auth
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await apiClient.post("/login", { email, password })

    if (response.status === 503) {
      throw new Error("Backend not available. Please try again later.")
    }

    if (response.ok) {
      await checkAuth()
    } else {
      let errorMessage = "Login failed"
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (parseError) {
        // Use default error message
      }
      throw new Error(errorMessage)
    }
  }

  const logout = async () => {
    try {
      await apiClient.get("/auth/logout")
    } catch (error) {
      console.error("Logout error:", error)
      // Continue with logout even if API call fails
    }
    setUser(null)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
