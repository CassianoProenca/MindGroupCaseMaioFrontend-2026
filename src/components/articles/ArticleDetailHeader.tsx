import { Bookmark, Eye, Heart, MessageSquare, Share2 } from "lucide-react"

import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { formatDate, getReadingTime } from "@/lib/format"
import type { Article } from "@/types/api"

type ArticleDetailHeaderProps = {
  article: Article
  likesCount: number
  isLiked: boolean
  isBookmarked: boolean
  onLikeToggle: () => void
  onBookmarkToggle: () => void
  onShare: () => void
}

export function ArticleDetailHeader({
  article,
  likesCount,
  isLiked,
  isBookmarked,
  onLikeToggle,
  onBookmarkToggle,
  onShare,
}: ArticleDetailHeaderProps) {
  return (
    <header className="detail-header">
      <Badge tone="warning">{article.category ?? "Desenvolvimento web"}</Badge>
      <h1>{article.title}</h1>
      <p>{article.summary ?? "Explorando as tendencias e inovacoes que moldarao o futuro da tecnologia."}</p>
      <div className="detail-author-row">
        <Avatar name={article.author.name} url={article.author.avatarUrl} />
        <div>
          <strong>{article.author.name}</strong>
          <span>
            {formatDate(article.publishedAt)} - {article.readingTimeMinutes ?? getReadingTime(article.content)}min
          </span>
        </div>
        <div className="detail-actions">
          <button type="button" className={isLiked ? "detail-action liked" : "detail-action"} onClick={onLikeToggle}>
            <Heart size={18} />
            <span>{likesCount}</span>
          </button>
          <button
            type="button"
            className={isBookmarked ? "detail-action bookmarked" : "detail-action"}
            onClick={onBookmarkToggle}
            aria-label={isBookmarked ? "Remover dos salvos" : "Salvar artigo"}
            aria-pressed={isBookmarked}
          >
            <Bookmark size={18} />
          </button>
          <button type="button" className="detail-action" onClick={onShare} aria-label="Compartilhar artigo">
            <Share2 size={18} />
          </button>
        </div>
      </div>
      <div className="detail-stats">
        <span>
          <Heart size={16} />
          {likesCount} {likesCount === 1 ? "curtida" : "curtidas"}
        </span>
        <span>
          <Eye size={16} />
          {article.viewsCount} {article.viewsCount === 1 ? "visualizacao" : "visualizacoes"}
        </span>
        <span>
          <MessageSquare size={16} />
          {article.commentsCount} {article.commentsCount === 1 ? "comentario" : "comentarios"}
        </span>
      </div>
    </header>
  )
}
