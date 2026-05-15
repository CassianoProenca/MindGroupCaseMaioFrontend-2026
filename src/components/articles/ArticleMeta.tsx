import { Clock3, Eye, Heart, MessageSquare } from "lucide-react"

import { getReadingTime } from "@/lib/format"
import type { Article } from "@/types/api"

type ArticleMetaProps = {
  article: Article
  compact?: boolean
}

export function ArticleMeta({ article, compact = false }: ArticleMetaProps) {
  return (
    <div className={compact ? "article-meta compact" : "article-meta"}>
      <span>
        <Clock3 size={14} />
        {getReadingTime(article.content)}min
      </span>
      <span>
        <Eye size={14} />
        122
      </span>
      <span>
        <Heart size={14} />1
      </span>
      {!compact ? (
        <span>
          <MessageSquare size={14} />2 comentarios
        </span>
      ) : null}
    </div>
  )
}
