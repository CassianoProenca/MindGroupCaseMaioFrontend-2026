import { useEffect, useMemo, useState, type FormEvent } from "react"
import { ArrowLeft, Heart, Share2 } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { ArticleMeta } from "@/components/articles/ArticleMeta"
import { Badge } from "@/components/ui/Badge"
import { StateBlock } from "@/components/ui/StateBlock"
import { useAuth } from "@/context/AuthContext"
import { getReaderId, hasViewedArticle, markArticleAsViewed, useArticleReadTracker } from "@/hooks/useArticleReadTracker"
import { formatDate, getArticleImage, getArticleImageFallback } from "@/lib/format"
import { getApiErrorMessage } from "@/services/api"
import {
  createComment,
  getArticle,
  getArticleLikeStatus,
  likeArticle,
  listComments,
  registerArticleView,
  unlikeArticle,
} from "@/services/articles"
import type { Article, Comment, PaginationMeta } from "@/types/api"

const commentsPerPage = 5

const emptyCommentsMeta: PaginationMeta = {
  page: 1,
  perPage: commentsPerPage,
  total: 0,
  totalPages: 1,
}

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
  const [commentsMeta, setCommentsMeta] = useState<PaginationMeta>(emptyCommentsMeta)
  const [commentSearch, setCommentSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [commentError, setCommentError] = useState("")
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [shareFeedback, setShareFeedback] = useState("")

  useArticleReadTracker(article?.id ?? null, token)

  useEffect(() => {
    if (!id) {
      return
    }

    let isMounted = true
    const articleId = Number(id)

    Promise.allSettled([
      getArticle(id),
      !hasViewedArticle(articleId) ? registerArticleView(id, getReaderId()) : Promise.resolve(null),
    ])
      .then(([articleResult, viewResult]) => {
        if (!isMounted) {
          return
        }

        if (articleResult.status === "fulfilled") {
          const nextArticle = articleResult.value.article
          const viewCount =
            viewResult.status === "fulfilled" && viewResult.value
              ? viewResult.value.article.viewsCount
              : nextArticle.viewsCount
          setArticle({ ...nextArticle, viewsCount: viewCount })
          markArticleAsViewed(articleId)
        } else {
          setArticle(null)
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

  useEffect(() => {
    if (!id || !isAuthenticated || !token) {
      setIsLiked(false)
      return
    }

    let isMounted = true

    getArticleLikeStatus(id, token)
      .then((response) => {
        if (isMounted) {
          setIsLiked(Boolean(response.liked))
          setArticle((current) =>
            current
              ? {
                  ...current,
                  likesCount: response.article.likesCount,
                }
              : current,
          )
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLiked(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [id, isAuthenticated, token])

  useEffect(() => {
    if (!id) {
      return
    }

    let isMounted = true
    setIsLoadingComments(true)

    listComments(id, {
      page: 1,
      perPage: commentsPerPage,
      search: commentSearch.trim() || undefined,
    })
      .then(({ comments, meta }) => {
        if (isMounted) {
          setComments(comments)
          setCommentsMeta(meta ?? emptyCommentsMeta)
        }
      })
      .catch(() => {
        if (isMounted) {
          setComments([])
          setCommentsMeta(emptyCommentsMeta)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingComments(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [id, commentSearch])

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

    const form = event.currentTarget
    const formData = new FormData(form)
    const content = String(formData.get("content") ?? "")
    setCommentError("")
    setIsSubmittingComment(true)

    try {
      const response = await createComment(id, { content }, token)
      setComments((current) => [response.comment, ...current])
      setCommentsMeta((current) => ({ ...current, total: current.total + 1 }))
      form.reset()
    } catch (error) {
      setCommentError(getApiErrorMessage(error))
    } finally {
      setIsSubmittingComment(false)
    }
  }

  async function handleLoadMoreComments() {
    if (!id || commentsMeta.page >= commentsMeta.totalPages) {
      return
    }

    setIsLoadingComments(true)

    try {
      const nextPage = commentsMeta.page + 1
      const response = await listComments(id, {
        page: nextPage,
        perPage: commentsPerPage,
        search: commentSearch.trim() || undefined,
      })
      setComments((current) => [...current, ...response.comments])
      setCommentsMeta(response.meta ?? commentsMeta)
    } finally {
      setIsLoadingComments(false)
    }
  }

  async function handleShare() {
    if (!article) {
      return
    }

    const url = window.location.href
    const shareData = {
      title: article.title,
      text: article.summary ?? article.title,
      url,
    }

    try {
      if (typeof navigator.share === "function") {
        await navigator.share(shareData)
        return
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url)
        setShareFeedback("Link copiado!")
        setTimeout(() => setShareFeedback(""), 2500)
      }
    } catch {
      // usuario cancelou o share dialog ou bloqueou clipboard
    }
  }

  async function handleLikeToggle() {
    if (!id || !article) {
      return
    }

    if (!token) {
      setCommentError("Faca login para curtir artigos.")
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
              <span>{article.likesCount}</span>
            </button>
            <button type="button" className="detail-action" onClick={handleShare} aria-label="Compartilhar artigo">
              <Share2 size={18} />
            </button>
            {shareFeedback ? <span className="share-feedback">{shareFeedback}</span> : null}
          </div>
        </div>
        <ArticleMeta article={article} />
      </header>

      <img
        className="detail-banner"
        src={getArticleImage(article.id, article.bannerUrl)}
        alt=""
        onError={(event) => {
          event.currentTarget.src = getArticleImageFallback(article.id)
        }}
      />

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
        <h2>Comentarios ({commentsMeta.total})</h2>
        <label className="search-box comments-search">
          <input
            value={commentSearch}
            onChange={(event) => setCommentSearch(event.target.value)}
            placeholder="Buscar comentarios..."
          />
        </label>
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
        {commentsMeta.page < commentsMeta.totalPages ? (
          <button type="button" className="button-secondary comments-more" disabled={isLoadingComments} onClick={handleLoadMoreComments}>
            {isLoadingComments ? "Carregando..." : "Carregar mais comentarios"}
          </button>
        ) : null}
      </section>
    </article>
  )
}
