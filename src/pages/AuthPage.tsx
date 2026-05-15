import type { FormEvent } from "react"
import { useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"

import { AuthCard } from "@/components/auth/AuthCard"
import { useAuth } from "@/context/AuthContext"

type AuthPageProps = {
  mode: "login" | "register"
}

type LocationState = {
  from?: string
}

export function AuthPage({ mode }: AuthPageProps) {
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isAuthenticated, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as LocationState | null)?.from ?? "/dashboard"

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "")
    const password = String(formData.get("password") ?? "")

    try {
      if (mode === "login") {
        await login({ email, password })
      } else {
        const name = String(formData.get("name") ?? "")
        const confirmPassword = String(formData.get("confirmPassword") ?? "")

        if (password !== confirmPassword) {
          setError("As senhas nao conferem.")
          return
        }

        await register({ name, email, password })
      }

      navigate(from, { replace: true })
    } catch (error) {
      setError(error instanceof Error ? error.message : "Nao foi possivel autenticar.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <img src="/M-logo.svg" alt="" className="auth-logo" />
      <h1>{mode === "login" ? "Entrar na Plataforma" : "Entrar na Plataforma"}</h1>
      <p>Acesse sua conta para gerenciar seus artigos</p>
      <AuthCard mode={mode} error={error} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
    </section>
  )
}
