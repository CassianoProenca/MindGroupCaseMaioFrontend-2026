import { Clock3 } from "lucide-react"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/Badge"
import { formatDate, getArticleImage, getArticleImageFallback, getExcerpt } from "@/lib/format"
import type { Article } from "@/types/api"

import { ArticleMeta } from "./ArticleMeta"

type ArticleCardProps = {
  article: Article
  highlighted?: boolean
  compact?: boolean
}

export function ArticleCard({ article, highlighted = false, compact = false }: ArticleCardProps) {
  const classNames = [
    "article-card",
    highlighted ? "article-card--highlighted" : null,
    compact ? "article-card--compact" : null,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <article className={classNames}>
      {!compact ? (
        <Link to={`/artigos/${article.id}`} className="article-card-image">
          <img
            src={getArticleImage(article.id, article.bannerUrl)}
            alt=""
            onError={(event) => {
              event.currentTarget.src = getArticleImageFallback(article.id)
            }}
          />
        </Link>
      ) : null}
      <div className="article-card-body">
        <div className="card-topline">
          <Badge>{article.category ?? "Desenvolvimento web"}</Badge>
          {!compact ? (
            <span>
              <Clock3 size={14} />
              {formatDate(article.publishedAt)}
            </span>
          ) : null}
        </div>
        <Link to={`/artigos/${article.id}`}>
          <h3>{article.title}</h3>
        </Link>
        <p>{getExcerpt(article.content)}</p>
        <div className="card-footerline">
          <span>{article.author.name}</span>
          {compact ? (
            <span>
              <Clock3 size={14} />
              {formatDate(article.publishedAt)}
            </span>
          ) : (
            <ArticleMeta article={article} compact />
          )}
        </div>
      </div>
    </article>
  )
}
