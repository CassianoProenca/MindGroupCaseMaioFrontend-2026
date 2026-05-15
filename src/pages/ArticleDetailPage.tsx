import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, Bookmark, Heart, Share2 } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { ArticleMeta } from "@/components/articles/ArticleMeta"
import { Badge } from "@/components/ui/Badge"
import { StateBlock } from "@/components/ui/StateBlock"
import { useAuth } from "@/context/AuthContext"
import { mockArticles } from "@/data/mockArticles"
import { formatDate, getArticleImage } from "@/lib/format"
import { getArticle } from "@/services/articles"
import type { Article } from "@/types/api"

function renderContent(content: string) {
  return content.split("\n").map((line, index) => {
    if (!line.trim()) {
      return null
    }

    if (line.startsWith("## ")) {
      return <h3 key={`${line}-${index}`}>{line.replace("## ", "")}</h3>
    }

    return <p key={`${line}-${index}`}>{line}</p>
  })
}

export function ArticleDetailPage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      return
    }

    getArticle(id)
      .then(({ article }) => setArticle(article))
      .catch(() => setArticle(mockArticles.find((article) => article.id === Number(id)) ?? mockArticles[0]))
      .finally(() => setIsLoading(false))
  }, [id])

  const comments = useMemo(
    () => [
      {
        author: "John Doe",
        date: "20/01/2026",
        text: "Excelente artigo! Muito bem explicado sobre as tendencias de IA.",
        likes: 1,
      },
      {
        author: "Marie Smith",
        date: "20/01/2026",
        text: "Artigo muito interessante, mostra claramente como a IA esta deixando de ser tendencia para se tornar parte essencial das solucoes do dia a dia.",
        likes: 4,
      },
    ],
    [],
  )

  if (isLoading) {
    return <StateBlock title="Carregando artigo">Preparando a leitura.</StateBlock>
  }

  if (!article) {
    return <StateBlock title="Artigo nao encontrado">Volte para a listagem e tente novamente.</StateBlock>
  }

  return (
    <article className="detail-page">
      <Link to="/artigos" className="page-kicker">
        <ArrowLeft size={20} />
        Voltar aos Artigos
      </Link>
      <div className="page-rule" />

      <header className="detail-header">
        <Badge tone="warning">Desenvolvimento web</Badge>
        <h1>{article.title}</h1>
        <p>Explorando as tendencias e inovacoes que moldarao o futuro da tecnologia nos proximos anos.</p>
        <div className="detail-author-row">
          <div className="avatar-placeholder">{article.author.name.charAt(0).toUpperCase()}</div>
          <div>
            <strong>{article.author.name}</strong>
            <span>{formatDate(article.publishedAt)} • 6min</span>
          </div>
          <div className="detail-actions">
            <Heart size={18} />
            <Bookmark size={18} />
            <Share2 size={18} />
          </div>
        </div>
        <ArticleMeta article={article} />
      </header>

      <img className="detail-banner" src={getArticleImage(article.id, article.bannerUrl)} alt="" />

      <div className="article-prose">
        <h2>{article.title}</h2>
        {renderContent(article.content)}
      </div>

      <div className="tag-row">
        <Badge>Desenvolvimento web</Badge>
        <Badge>Inteligencia Artificial</Badge>
        <Badge>Desenvolvimento backend</Badge>
      </div>

      <section className="comments-section">
        <h2>Comentario (2)</h2>
        {isAuthenticated ? (
          <div className="comment-box">
            <textarea defaultValue="Otimo artigo. Esperando pelo proximo!" />
            <button type="button" className="button-primary">
              Publicar Comentario
            </button>
          </div>
        ) : (
          <div className="login-comment-box">
            <span>Faca login para comentar</span>
            <Link to="/login" className="button-primary">
              Fazer login
            </Link>
          </div>
        )}
        {comments.map((comment) => (
          <article className="comment-card" key={`${comment.author}-${comment.text}`}>
            <div className="avatar-placeholder">{comment.author.charAt(0)}</div>
            <div>
              <strong>{comment.author}</strong>
              <span>{comment.date}</span>
              <p>{comment.text}</p>
            </div>
            <span className="comment-like">
              <Heart size={15} />
              {comment.likes}
            </span>
          </article>
        ))}
      </section>
    </article>
  )
}
