import { Edit3, Heart, MessageSquare, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"

import { Pagination } from "@/components/ui/Pagination"
import { StateBlock } from "@/components/ui/StateBlock"
import { formatDate, getArticleImage, getArticleImageFallback, getExcerpt } from "@/lib/format"
import type { DashboardMetricsResponse } from "@/types/api"

export type DashboardArticle = DashboardMetricsResponse["metrics"]["articleMetrics"][number]

type DashboardArticlesProps = {
  articles: DashboardArticle[]
  visibleArticles: DashboardArticle[]
  page: number
  totalPages: number
  isLoading: boolean
  onPageChange: (next: number) => void
  onDelete: (article: DashboardArticle) => void
}

export function DashboardArticles({
  articles,
  visibleArticles,
  page,
  totalPages,
  isLoading,
  onPageChange,
  onDelete,
}: DashboardArticlesProps) {
  return (
    <section className="surface-panel dashboard-list-panel">
      <h2>Meus Artigos</h2>
      {isLoading ? <StateBlock title="Carregando artigos" /> : null}
      {!isLoading && articles.length === 0 ? <StateBlock title="Nenhum artigo publicado" /> : null}
      {!isLoading
        ? visibleArticles.map((article) => (
            <article className="dashboard-article" key={article.id}>
              <img
                src={getArticleImage(article.id, article.bannerUrl)}
                alt=""
                onError={(event) => {
                  event.currentTarget.src = getArticleImageFallback(article.id)
                }}
              />
              <div>
                <h3>{article.title}</h3>
                <p>{getExcerpt(article.summary || "Sem resumo cadastrado.", 85)}</p>
                <span className="dashboard-article-meta">
                  <span>{formatDate(article.publishedAt)}</span>
                  <span aria-hidden="true">&bull;</span>
                  <span>
                    <MessageSquare size={14} />
                    {article.commentsCount}
                  </span>
                  <span aria-hidden="true">&bull;</span>
                  <span>
                    <Heart size={14} />
                    {article.likesCount}
                  </span>
                </span>
              </div>
              <div className="dashboard-row-actions">
                <Link to={`/artigos/${article.id}/editar`} className="button-secondary">
                  <Edit3 size={16} />
                  Editar
                </Link>
                <button type="button" className="button-danger" onClick={() => onDelete(article)}>
                  <Trash2 size={16} />
                  Excluir
                </button>
              </div>
            </article>
          ))
        : null}
      {!isLoading ? (
        <Pagination page={page} totalPages={totalPages} onChange={onPageChange} className="dashboard-pagination" />
      ) : null}
    </section>
  )
}
