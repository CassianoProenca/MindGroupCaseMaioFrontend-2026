import type { FormEvent } from "react"
import { Heart } from "lucide-react"
import { Link } from "react-router-dom"

import { Avatar } from "@/components/ui/Avatar"
import { useArticleComments } from "@/hooks/useArticleComments"
import { formatDate } from "@/lib/format"

type CommentsSectionProps = {
  articleId: string
  isAuthenticated: boolean
  token: string | null
}

export function CommentsSection({ articleId, isAuthenticated, token }: CommentsSectionProps) {
  const { comments, meta, search, setSearch, isLoading, loadMore, submit, isSubmitting, error } =
    useArticleComments(articleId)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!token) {
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)
    const content = String(formData.get("content") ?? "")

    try {
      await submit(content, token)
      form.reset()
    } catch {
      // erro já está exposto via hook
    }
  }

  return (
    <section className="comments-section">
      <h2>
        {meta.total === 1 ? "Comentario" : "Comentarios"} ({meta.total})
      </h2>
      <label className="search-box comments-search">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar comentarios..."
        />
      </label>
      {isAuthenticated ? (
        <form className="comment-box" onSubmit={handleSubmit}>
          <textarea name="content" placeholder="Otimo artigo. Esperando pelo proximo!" />
          {error ? <p className="form-error">{error}</p> : null}
          <button type="submit" className="button-primary" disabled={isSubmitting}>
            {isSubmitting ? "Publicando..." : "Publicar Comentario"}
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
          <Avatar name={comment.author.name} url={comment.author.avatarUrl} />
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
      {meta.page < meta.totalPages ? (
        <button
          type="button"
          className="button-secondary comments-more"
          disabled={isLoading}
          onClick={loadMore}
        >
          {isLoading ? "Carregando..." : "Carregar mais comentarios"}
        </button>
      ) : null}
    </section>
  )
}
