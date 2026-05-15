import { Clock3 } from "lucide-react"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/Badge"
import { formatDate, getArticleImage, getExcerpt } from "@/lib/format"
import type { Article } from "@/types/api"

import { ArticleMeta } from "./ArticleMeta"

type ArticleListItemProps = {
  article: Article
}

export function ArticleListItem({ article }: ArticleListItemProps) {
  return (
    <article className="article-list-item">
      <Link to={`/artigos/${article.id}`} className="article-list-image">
        <img src={getArticleImage(article.id, article.bannerUrl)} alt="" />
      </Link>
      <div className="article-list-content">
        <div className="card-topline">
          <Badge>Desenvolvimento web</Badge>
          <span>
            <Clock3 size={14} />
            {formatDate(article.publishedAt)}
          </span>
        </div>
        <Link to={`/artigos/${article.id}`}>
          <h3>{article.title}</h3>
        </Link>
        <p>{getExcerpt(article.content, 170)}</p>
        <span className="list-author">{article.author.name}</span>
      </div>
      <ArticleMeta article={article} compact />
    </article>
  )
}
