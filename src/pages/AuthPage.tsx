type AuthPageProps = {
  mode: "login" | "register"
}

export function AuthPage({ mode }: AuthPageProps) {
  return <section className="page-container">{mode === "login" ? "Login" : "Cadastro"}</section>
}
