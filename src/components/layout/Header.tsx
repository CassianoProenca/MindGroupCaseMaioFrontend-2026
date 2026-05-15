import { Link, NavLink } from "react-router-dom"

export function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="brand-link" aria-label="TechBlog home">
        <img src="/M-logo.svg" alt="" className="brand-logo" />
      </Link>

      <nav className="site-nav" aria-label="Navegacao principal">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/artigos">Artigos</NavLink>
        <span className="nav-divider" />
        <button type="button" className="icon-button" aria-label="Alternar tema">
          ☾
        </button>
        <NavLink to="/login">Entrar</NavLink>
        <NavLink to="/cadastro" className="nav-cta">
          Cadastrar
        </NavLink>
      </nav>
    </header>
  )
}
