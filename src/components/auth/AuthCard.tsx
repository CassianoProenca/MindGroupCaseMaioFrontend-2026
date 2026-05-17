import type { FormEvent } from "react"
import { LogIn, UserPlus } from "lucide-react"
import { Link } from "react-router-dom"

import { TextInput } from "@/components/ui/FormField"

type AuthCardProps = {
  mode: "login" | "register"
  error: string
  isSubmitting: boolean
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function AuthCard({ mode, error, isSubmitting, onSubmit }: AuthCardProps) {
  const isLogin = mode === "login"

  return (
    <section className="auth-card surface-panel">
      <form onSubmit={onSubmit}>
        {!isLogin ? <TextInput name="name" label="Nome Completo" placeholder="John Doe" required /> : null}
        <TextInput name="email" label="Email" type="email" placeholder="exemplo@email.com" required />
        <TextInput
          name="password"
          label="Senha"
          type="password"
          placeholder="********"
          required
          minLength={6}
          action={isLogin ? <Link to="/esqueci-minha-senha">Esqueceu a senha?</Link> : null}
        />
        {!isLogin ? (
          <TextInput
            name="confirmPassword"
            label="Confirmar senha"
            type="password"
            placeholder="********"
            required
            minLength={6}
          />
        ) : null}

        {error ? <p className="form-error">{error}</p> : null}

        <button className="button-primary auth-submit" type="submit" disabled={isSubmitting}>
          {isLogin ? <LogIn size={17} /> : <UserPlus size={17} />}
          {isSubmitting ? "Enviando..." : isLogin ? "Entrar" : "Criar conta"}
        </button>

        <div className="auth-separator" />
        <p className="auth-switch">
          {isLogin ? "Nao tem uma conta?" : "Ja tem uma conta?"}{" "}
          <Link to={isLogin ? "/cadastro" : "/login"}>{isLogin ? "Criar conta" : "Fazer login"}</Link>
        </p>
      </form>
    </section>
  )
}
