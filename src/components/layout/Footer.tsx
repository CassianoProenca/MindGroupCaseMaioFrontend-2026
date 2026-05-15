import { Code2, Network, Share2 } from "lucide-react"
import { Link } from "react-router-dom"

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <img src="/M-logo.svg" alt="" className="footer-logo" />
          <p>Seu portal de tecnologia com artigos, tutoriais e novidades do mundo tech.</p>
        </div>

        <nav aria-label="Navegacao do rodape">
          <strong>Navegacao</strong>
          <Link to="/">Home</Link>
          <Link to="/artigos">Artigos</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>

        <div>
          <strong>Redes Sociais</strong>
          <div className="social-links" aria-label="Redes sociais">
            <Network size={18} />
            <Code2 size={18} />
            <Share2 size={18} />
          </div>
        </div>
      </div>
      <div className="footer-bottom">© 2025 TechBlog. Todos os direitos reservados.</div>
    </footer>
  )
}
