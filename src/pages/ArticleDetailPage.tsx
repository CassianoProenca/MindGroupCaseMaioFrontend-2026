import { useEffect, useMemo, useState, type FormEvent } from "react"
import { ArrowLeft, Bookmark, Heart, Share2 } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { ArticleMeta } from "@/components/articles/ArticleMeta"
import { Badge } from "@/components/ui/Badge"
import { StateBlock } from "@/components/ui/StateBlock"
import { useAuth } from "@/context/AuthContext"
import { mockArticles } from "@/data/mockArticles"
import { formatDate, getArticleImage } from "@/lib/format"
import { getApiErrorMessage } from "@/services/api"
import {
  createComment,
  getArticle,
  likeArticle,
  listComments,
  registerArticleView,
  unlikeArticle,
} from "@/services/articles"
import type { Article, Comment } from "@/types/api"

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
  const { isAuthenticated, token } = useAuth()
  const [article, setArticle] = useState<Article | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [commentError, setCommentError] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  useEffect(() => {
    if (!id) {
      return
    }

    let isMounted = true

    Promise.allSettled([getArticle(id), listComments(id), registerArticleView(id)])
      .then(([articleResult, commentsResult, viewResult]) => {
        if (!isMounted) {
          return
        }

        if (articleResult.status === "fulfilled") {
          const nextArticle = articleResult.value.article
          const viewCount =
            viewResult.status === "fulfilled" ? viewResult.value.article.viewsCount : nextArticle.viewsCount
          setArticle({ ...nextArticle, viewsCount: viewCount })
        } else {
          setArticle(mockArticles.find((article) => article.id === Number(id)) ?? mockArticles[0])
        }

        if (commentsResult.status === "fulfilled") {
          setComments(commentsResult.value.comments)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [id])

  const visibleTags = useMemo(() => {
    if (!article) {
      return []
    }

    return article.tags.length > 0 ? article.tags : ["Desenvolvimento web"]
  }, [article])

  async function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!id || !token) {
      return
    }

    const formData = new FormData(event.currentTarget)
    const content = String(formData.get("content") ?? "")
    setCommentError("")
    setIsSubmittingComment(true)

    try {
      const response = await createComment(id, { content }, token)
      setComments((current) => [response.comment, ...current])
      event.currentTarget.reset()
    } catch (error) {
      setCommentError(getApiErrorMessage(error))
    } finally {
      setIsSubmittingComment(false)
    }
  }

  async function handleLikeToggle() {
    if (!id || !token || !article) {
      return
    }

    try {
      const response = isLiked ? await unlikeArticle(id, token) : await likeArticle(id, token)
      setIsLiked(Boolean(response.liked))
      setArticle((current) =>
        current
          ? {
              ...current,
              likesCount: response.article.likesCount,
              viewsCount: response.article.viewsCount,
            }
          : current,
      )
    } catch {
      setCommentError("Nao foi possivel atualizar a curtida.")
    }
  }

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
        <Badge tone="warning">{article.category ?? "Desenvolvimento web"}</Badge>
        <h1>{article.title}</h1>
        <p>{article.summary ?? "Explorando as tendencias e inovacoes que moldarao o futuro da tecnologia."}</p>
        <div className="detail-author-row">
          <div className="avatar-placeholder">{article.author.name.charAt(0).toUpperCase()}</div>
          <div>
            <strong>{article.author.name}</strong>
            <span>{formatDate(article.publishedAt)} - 6min</span>
          </div>
          <div className="detail-actions">
            <button type="button" className={isLiked ? "detail-action liked" : "detail-action"} onClick={handleLikeToggle}>
              <Heart size={18} />
            </button>
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
        {visibleTags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      <section className="comments-section">
        <h2>Comentarios ({comments.length})</h2>
        {isAuthenticated ? (
          <form className="comment-box" onSubmit={handleCommentSubmit}>
            <textarea name="content" placeholder="Otimo artigo. Esperando pelo proximo!" />
            {commentError ? <p className="form-error">{commentError}</p> : null}
            <button type="submit" className="button-primary" disabled={isSubmittingComment}>
              {isSubmittingComment ? "Publicando..." : "Publicar Comentario"}
            </button>
          </form>
        ) : (
          <div className="login-comment-box">
            <span>Faca login para comentar</span>
            <Link to="/login" className="button-primary">
              Fazer login
            </Link>
          </div>
        )}
        {comments.map((comment) => (
          <article className="comment-card" key={comment.id}>
            <div className="avatar-placeholder">{comment.author.name.charAt(0).toUpperCase()}</div>
            <div>
              <strong>{comment.author.name}</strong>
              <span>{formatDate(comment.createdAt)}</span>
              <p>{comment.content}</p>
            </div>
            <span className="comment-like">
              <Heart size={15} />0
            </span>
          </article>
        ))}
      </section>
    </article>
  )
}
