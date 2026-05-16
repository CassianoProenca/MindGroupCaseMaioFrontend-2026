import { ArrowRight, Mail } from "lucide-react"
import { Link } from "react-router-dom"

import { ArticleCard } from "@/components/articles/ArticleCard"
import { useArticles } from "@/hooks/useArticles"

export function HomePage() {
  const { articles } = useArticles()
  const featured = articles.slice(0, 4)
  const recent = articles.slice(4, 8)

  return (
    <>
      <section className="home-hero">
        <h1>
          Explore o Futuro da <span>Tecnologia</span>
        </h1>
        <p>Artigos sobre IA, desenvolvimento, DevOps e as ultimas tendencias tecnologicas</p>
        <div className="hero-actions">
          <Link to="/artigos" className="button-primary">
            Explorar Artigos
          </Link>
          <Link to="/cadastro" className="button-secondary">
            Comecar a Escrever
          </Link>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <div>
            <h2 className="section-title">Artigos em Destaque</h2>
            <p className="section-subtitle">Os melhores conteudos selecionados para voce</p>
          </div>
          <Link to="/artigos">
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>
        <div className="article-grid featured-grid">
          {featured.map((article, index) => (
            <ArticleCard key={article.id} article={article} highlighted={index === 1} />
          ))}
        </div>
      </section>

      <section className="home-section">
        <h2 className="section-title">Artigos Recentes</h2>
        <p className="section-subtitle">Conteudo recente da comunidade</p>
        <div className="recent-grid">
          {recent.map((article, index) => (
            <ArticleCard key={article.id} article={article} highlighted={index === 1} />
          ))}
        </div>
      </section>

      <section className="newsletter-band">
        <Mail size={34} />
        <h2>Newsletter Semanal</h2>
        <p>Receba os melhores artigos de tecnologia diretamente no seu email. Sem spam, apenas conteudo de qualidade.</p>
        <form>
          <input placeholder="exemplo@email.com" type="email" />
          <button type="button">Inscrever</button>
        </form>
      </section>

      <section className="share-knowledge-band">
        <h2>Compartilhe Seu Conhecimento</h2>
        <p>Junte-se a nossa comunidade de escritores e compartilhe suas experiencias e conhecimentos em tecnologia.</p>
        <Link to="/cadastro" className="button-primary">
          Criar Conta Gratuita
        </Link>
      </section>
    </>
  )
}
