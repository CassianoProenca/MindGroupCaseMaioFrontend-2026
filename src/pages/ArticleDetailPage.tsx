/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { ArticleContent } from "@/components/articles/ArticleContent"
import { ArticleDetailHeader } from "@/components/articles/ArticleDetailHeader"
import { CommentsSection } from "@/components/articles/CommentsSection"
import { ShareModal } from "@/components/articles/ShareModal"
import { Badge } from "@/components/ui/Badge"
import { StateBlock } from "@/components/ui/StateBlock"
import { useAuth } from "@/context/AuthContext"
import { useArticleEngagement } from "@/hooks/useArticleEngagement"
import {
  getReaderId,
  hasViewedArticle,
  markArticleAsViewed,
  useArticleReadTracker,
} from "@/hooks/useArticleReadTracker"
import { getArticleImage, getArticleImageFallback } from "@/lib/format"
import { getArticle, registerArticleView } from "@/services/articles"
import type { Article } from "@/types/api"

export function ArticleDetailPage() {
  const { id } = useParams()
  const { isAuthenticated, token } = useAuth()
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isShareOpen, setIsShareOpen] = useState(false)

  const engagement = useArticleEngagement(id, token, isAuthenticated)

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

  const visibleTags = useMemo(() => {
    if (!article) {
      return []
    }

    return article.tags.length > 0 ? article.tags : ["Desenvolvimento web"]
  }, [article])

  if (isLoading) {
    return <StateBlock title="Carregando artigo">Preparando a leitura.</StateBlock>
  }

  if (!article) {
    return <StateBlock title="Artigo nao encontrado">Volte para a listagem e tente novamente.</StateBlock>
  }

  const likesCount = engagement.likesCount ?? article.likesCount

  return (
    <article className="detail-page">
      <Link to="/artigos" className="page-kicker">
        <ArrowLeft size={20} />
        Voltar aos Artigos
      </Link>
      <div className="page-rule" />

      <ArticleDetailHeader
        article={article}
        likesCount={likesCount}
        isLiked={engagement.isLiked}
        isBookmarked={engagement.isBookmarked}
        onLikeToggle={engagement.toggleLike}
        onBookmarkToggle={engagement.toggleBookmark}
        onShare={() => setIsShareOpen(true)}
      />

      <img
        className="detail-banner"
        src={getArticleImage(article.id, article.bannerUrl)}
        alt=""
        onError={(event) => {
          event.currentTarget.src = getArticleImageFallback(article.id)
        }}
      />

      <ArticleContent title={article.title} content={article.content} />

      <div className="tag-row">
        {visibleTags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      {id ? <CommentsSection articleId={id} isAuthenticated={isAuthenticated} token={token} /> : null}

      <ShareModal
        open={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={article.title}
        url={window.location.href}
      />
    </article>
  )
}
