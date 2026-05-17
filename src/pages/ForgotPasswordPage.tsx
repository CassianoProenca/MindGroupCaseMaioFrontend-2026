import type { FormEvent } from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Mail } from "lucide-react"

import { TextInput } from "@/components/ui/FormField"
import { getApiErrorMessage } from "@/services/api"
import { forgotPassword } from "@/services/auth"

export function ForgotPasswordPage() {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "")

    try {
      const result = await forgotPassword({ email })
      setSuccess(
        result?.message ??
          "Se este email estiver cadastrado, voce recebera um link de redefinicao em instantes.",
      )
    } catch (error) {
      setError(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <img src="/M-logo.svg" alt="" className="auth-logo" />
      <h1>Esqueceu sua senha?</h1>
      <p>Informe o email da sua conta e enviaremos um link para redefinir a senha.</p>

      <section className="auth-card surface-panel">
        <form onSubmit={handleSubmit}>
          <TextInput
            name="email"
            label="Email"
            type="email"
            placeholder="exemplo@email.com"
            required
          />

          {error ? <p className="form-error">{error}</p> : null}
          {success ? <p className="form-success">{success}</p> : null}

          <button className="button-primary auth-submit" type="submit" disabled={isSubmitting}>
            <Mail size={17} />
            {isSubmitting ? "Enviando..." : "Enviar link de redefinicao"}
          </button>

          <div className="auth-separator" />
          <p className="auth-switch">
            Lembrou da senha? <Link to="/login">Voltar para login</Link>
          </p>
        </form>
      </section>
    </section>
  )
}
