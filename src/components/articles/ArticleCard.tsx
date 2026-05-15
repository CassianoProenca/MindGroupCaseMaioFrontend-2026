import { Clock3 } from "lucide-react"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/Badge"
import { formatDate, getArticleImage, getExcerpt } from "@/lib/format"
import type { Article } from "@/types/api"

import { ArticleMeta } from "./ArticleMeta"

type ArticleCardProps = {
  article: Article
  highlighted?: boolean
}

export function ArticleCard({ article, highlighted = false }: ArticleCardProps) {
  return (
    <article className={highlighted ? "article-card article-card--highlighted" : "article-card"}>
      <Link to={`/artigos/${article.id}`} className="article-card-image">
        <img src={getArticleImage(article.id, article.bannerUrl)} alt="" />
      </Link>
      <div className="article-card-body">
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
        <p>{getExcerpt(article.content)}</p>
        <div className="card-footerline">
          <span>{article.author.name}</span>
          <ArticleMeta article={article} compact />
        </div>
      </div>
    </article>
  )
}
