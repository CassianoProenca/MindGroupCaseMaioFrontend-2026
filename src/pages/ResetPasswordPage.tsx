import type { FormEvent } from "react"
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { KeyRound } from "lucide-react"

import { TextInput } from "@/components/ui/FormField"
import { useAuth } from "@/context/AuthContext"
import { ApiError, getApiErrorMessage } from "@/services/api"

export function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tokenInvalid, setTokenInvalid] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (!token) {
      setError("Link invalido. Solicite um novo email de redefinicao.")
      setTokenInvalid(true)
      return
    }

    const formData = new FormData(event.currentTarget)
    const password = String(formData.get("password") ?? "")
    const confirmPassword = String(formData.get("confirmPassword") ?? "")

    if (password !== confirmPassword) {
      setError("As senhas nao conferem.")
      return
    }

    setIsSubmitting(true)
    try {
      await resetPassword({ token, password })
      navigate("/dashboard", { replace: true })
    } catch (error) {
      setError(getApiErrorMessage(error))
      if (error instanceof ApiError && error.status === 400) {
        setTokenInvalid(true)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <img src="/M-logo.svg" alt="" className="auth-logo" />
      <h1>Redefinir senha</h1>
      <p>Escolha uma nova senha para a sua conta.</p>

      <section className="auth-card surface-panel">
        <form onSubmit={handleSubmit}>
          <TextInput
            name="password"
            label="Nova senha"
            type="password"
            placeholder="********"
            required
            minLength={6}
            disabled={tokenInvalid}
          />
          <TextInput
            name="confirmPassword"
            label="Confirmar senha"
            type="password"
            placeholder="********"
            required
            minLength={6}
            disabled={tokenInvalid}
          />

          {error ? <p className="form-error">{error}</p> : null}

          <button
            className="button-primary auth-submit"
            type="submit"
            disabled={isSubmitting || tokenInvalid}
          >
            <KeyRound size={17} />
            {isSubmitting ? "Salvando..." : "Salvar nova senha"}
          </button>

          <div className="auth-separator" />
          <p className="auth-switch">
            {tokenInvalid ? (
              <>
                Link expirado ou invalido?{" "}
                <Link to="/esqueci-minha-senha">Solicitar novo link</Link>
              </>
            ) : (
              <>
                Lembrou da senha? <Link to="/login">Voltar para login</Link>
              </>
            )}
          </p>
        </form>
      </section>
    </section>
  )
}
