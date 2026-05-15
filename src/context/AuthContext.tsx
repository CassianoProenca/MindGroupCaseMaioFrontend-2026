import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

import * as authService from "@/services/auth"
import type { User } from "@/types/api"

const TOKEN_KEY = "mind_blog_token"
const USER_KEY = "mind_blog_user"

type AuthContextValue = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: authService.LoginPayload) => Promise<void>
  register: (payload: authService.RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getStoredUser() {
  const storedUser = window.localStorage.getItem(USER_KEY)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser) as User
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState(() => window.localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(() => getStoredUser())
  const [isLoading, setIsLoading] = useState(Boolean(token))

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }

    authService
      .getMe(token)
      .then(({ user: currentUser }) => {
        setUser(currentUser)
        window.localStorage.setItem(USER_KEY, JSON.stringify(currentUser))
      })
      .catch(() => {
        window.localStorage.removeItem(TOKEN_KEY)
        window.localStorage.removeItem(USER_KEY)
        setToken(null)
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [token])

  function persistSession(nextToken: string, nextUser: User) {
    setToken(nextToken)
    setUser(nextUser)
    window.localStorage.setItem(TOKEN_KEY, nextToken)
    window.localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isLoading,
      login: async (payload) => {
        const response = await authService.login(payload)
        persistSession(response.token, response.user)
      },
      register: async (payload) => {
        const response = await authService.register(payload)
        persistSession(response.token, response.user)
      },
      logout: () => {
        setToken(null)
        setUser(null)
        window.localStorage.removeItem(TOKEN_KEY)
        window.localStorage.removeItem(USER_KEY)
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
