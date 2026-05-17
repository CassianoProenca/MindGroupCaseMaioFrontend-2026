/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

import { decodeToken, isTokenExpired } from "@/lib/jwt"
import * as authService from "@/services/auth"
import type { User } from "@/types/api"

const TOKEN_KEY = "mind_blog_token"
const LEGACY_USER_KEY = "mind_blog_user"

type AuthContextValue = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: authService.LoginPayload) => Promise<void>
  register: (payload: authService.RegisterPayload) => Promise<void>
  resetPassword: (payload: authService.ResetPasswordPayload) => Promise<void>
  logout: () => void
  applyToken: (token: string) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readInitialToken() {
  const stored = window.localStorage.getItem(TOKEN_KEY)
  window.localStorage.removeItem(LEGACY_USER_KEY)

  if (!stored) {
    return null
  }
  if (isTokenExpired(stored)) {
    window.localStorage.removeItem(TOKEN_KEY)
    return null
  }
  return stored
}

function userFromToken(token: string | null): User | null {
  if (!token) {
    return null
  }
  return decodeToken(token)?.user ?? null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => readInitialToken())
  const [user, setUser] = useState<User | null>(() => userFromToken(token))
  const [isLoading, setIsLoading] = useState(Boolean(token))

  useEffect(() => {
    if (!token) {
      return
    }

    authService
      .getMe(token)
      .then(({ user: currentUser }) => {
        setUser(currentUser)
      })
      .catch(() => {
        window.localStorage.removeItem(TOKEN_KEY)
        setToken(null)
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [token])

  function persistSession(nextToken: string) {
    window.localStorage.setItem(TOKEN_KEY, nextToken)
    setToken(nextToken)
    setUser(userFromToken(nextToken))
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login: async (payload) => {
        const response = await authService.login(payload)
        persistSession(response.token)
      },
      register: async (payload) => {
        const response = await authService.register(payload)
        persistSession(response.token)
      },
      resetPassword: async (payload) => {
        const response = await authService.resetPassword(payload)
        persistSession(response.token)
      },
      logout: () => {
        setToken(null)
        setUser(null)
        window.localStorage.removeItem(TOKEN_KEY)
      },
      applyToken: (nextToken) => {
        persistSession(nextToken)
      },
    }),
    [isLoading, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.")
  }

  return context
}
