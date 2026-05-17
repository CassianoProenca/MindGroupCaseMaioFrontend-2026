import { Moon, Sun } from "lucide-react"
import { Link, NavLink } from "react-router-dom"

import { UserMenu } from "@/components/auth/UserMenu"
import { BrandLogo } from "@/components/ui/BrandLogo"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"

export function Header() {
  const { isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <header className="site-header">
      <Link to="/" className="brand-link" aria-label="TechBlog home">
        <BrandLogo className="brand-logo" />
      </Link>

      <nav className="site-nav" aria-label="Navegacao principal">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/artigos">Artigos</NavLink>
        <span className="nav-divider" />
        <button
          type="button"
          className="icon-button icon-button--bare"
          aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
          aria-pressed={!isDark}
          title={isDark ? "Tema claro" : "Tema escuro"}
          onClick={toggleTheme}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {isAuthenticated ? (
          <UserMenu />
        ) : (
          <>
            <NavLink to="/login">Entrar</NavLink>
            <NavLink to="/cadastro" className="nav-cta">
              Cadastrar
            </NavLink>
          </>
        )}
      </nav>
    </header>
  )
}
