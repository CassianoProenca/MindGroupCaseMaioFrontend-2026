import { useEffect, useMemo, useState } from "react"
import { Edit3, FileText, FolderTree, Heart, MessageSquare, Plus, Settings, Trash2, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"

import { DeleteArticleModal } from "@/components/articles/DeleteArticleModal"
import { Avatar } from "@/components/ui/Avatar"
import { StateBlock } from "@/components/ui/StateBlock"
import { useAuth } from "@/context/AuthContext"
import { formatDate, formatDuration, formatRelativeTime, getArticleImage, getArticleImageFallback, getExcerpt } from "@/lib/format"
import { deleteArticle } from "@/services/articles"
import { getApiErrorMessage } from "@/services/api"
import { getMyDashboardMetrics, getMyRecentActivity } from "@/services/profile"
import type { DashboardMetricsResponse, PaginationMeta, RecentActivity } from "@/types/api"

type DashboardArticle = DashboardMetricsResponse["metrics"]["articleMetrics"][number]

const ACTIVITY_PER_PAGE = 3
const emptyActivityMeta: PaginationMeta = { page: 1, perPage: ACTIVITY_PER_PAGE, total: 0, totalPages: 1 }

export function DashboardPage() {
  const { user, token } = useAuth()
  const [page, setPage] = useState(1)
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetricsResponse["metrics"] | null>(null)
  const [metricsError, setMetricsError] = useState("")
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(Boolean(token))
  const [articleToDelete, setArticleToDelete] = useState<DashboardArticle | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletedArticleIds, setDeletedArticleIds] = useState<number[]>([])
  const [activity, setActivity] = useState<RecentActivity[]>([])
  const [activityMeta, setActivityMeta] = useState<PaginationMeta>(emptyActivityMeta)
  const [activityPage, setActivityPage] = useState(1)
  const [isLoadingActivity, setIsLoadingActivity] = useState(Boolean(token))

  const dashboardArticles = useMemo(() => {
    return dashboardMetrics?.articleMetrics.filter((article) => !deletedArticleIds.includes(article.id)) ?? []
  }, [dashboardMetrics, deletedArticleIds])
  const dashboardTotalPages = Math.max(1, Math.ceil(dashboardArticles.length / 4))
  const visibleDashboardArticles = dashboardArticles.slice((page - 1) * 4, page * 4)

  useEffect(() => {
    if (!token) {
      return
    }

    setIsLoadingMetrics(true)
    getMyDashboardMetrics(token)
      .then(({ metrics }) => {
        setDashboardMetrics(metrics)
        setMetricsError("")
        setPage(1)
      })
      .catch((error) => setMetricsError(getApiErrorMessage(error)))
      .finally(() => setIsLoadingMetrics(false))
  }, [token, deletedArticleIds])

  useEffect(() => {
    if (!token) {
      return
    }

    let isMounted = true
    setIsLoadingActivity(true)

    getMyRecentActivity(token, { page: activityPage, perPage: ACTIVITY_PER_PAGE })
      .then(({ activity, meta }) => {
        if (isMounted) {
          setActivity(activity)
          setActivityMeta(meta ?? emptyActivityMeta)
        }
      })
      .catch(() => {
        if (isMounted) {
          setActivity([])
          setActivityMeta(emptyActivityMeta)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingActivity(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [token, activityPage, deletedArticleIds])

  const stats = useMemo(() => {
    const totals = dashboardMetrics?.totals

    return [
      { label: "Total de Artigos", value: totals?.articles ?? 0, icon: FileText },
      { label: "Engajamento", value: totals?.engagement ?? 0, icon: MessageSquare },
      { label: "Curtidas", value: totals?.likes ?? 0, icon: Heart },
      {
        label: "Tempo medio de leitura",
        value: `${totals?.averageReadingTimeMinutes ?? 0} min`,
        icon: TrendingUp,
      },
    ]
  }, [dashboardMetrics])

  function getArticleMetrics(articleId: number) {
    return dashboardMetrics?.articleMetrics.find((article) => article.id === articleId)
  }

  async function handleDelete() {
    if (!articleToDelete || !token) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteArticle(articleToDelete.id, token)
      setDeletedArticleIds((current) => [...current, articleToDelete.id])
      setArticleToDelete(null)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <section className="page-container dashboard-page">
      <div className="dashboard-heading">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Bem-vindo de volta, {user?.name ?? "autor"}!</p>
        </div>
        <div className="dashboard-actions">
          <Link to="/configuracoes" className="button-secondary">
            <Settings size={18} />
            Configuracoes
          </Link>
          <Link to="/categorias" className="button-secondary">
            <FolderTree size={18} />
            Categorias
          </Link>
          <Link to="/artigos/novo" className="button-primary">
            <Plus size={18} />
            Novo Artigo
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        {isLoadingMetrics ? <StateBlock title="Carregando metricas" /> : null}
        {metricsError ? <p className="form-error">{metricsError}</p> : null}
        {!isLoadingMetrics
          ? stats.map((item) => {
              const Icon = item.icon
              return (
                <article className="stat-card" key={item.label}>
                  <div>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                  <Icon size={24} />
                </article>
              )
            })
          : null}
      </div>

      <div className="dashboard-grid">
        <section className="surface-panel dashboard-list-panel">
          <h2>Meus Artigos</h2>
          {isLoadingMetrics ? <StateBlock title="Carregando artigos" /> : null}
          {!isLoadingMetrics && dashboardArticles.length === 0 ? <StateBlock title="Nenhum artigo publicado" /> : null}
          {!isLoadingMetrics
            ? visibleDashboardArticles.map((article) => (
                <article className="dashboard-article" key={article.id}>
                  <img
                    src={getArticleImage(article.id, article.bannerUrl)}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.src = getArticleImageFallback(article.id)
                    }}
                  />
                  <div>
                    {(() => {
                      const articleMetrics = getArticleMetrics(article.id)
                      return (
                        <>
                          <h3>{article.title}</h3>
                          <p>{getExcerpt(article.summary || "Sem resumo cadastrado.", 85)}</p>
                          <span>
                            {formatDate(article.publishedAt)} - {articleMetrics?.viewsCount ?? article.viewsCount} views -{" "}
                            {articleMetrics?.likesCount ?? article.likesCount} likes -{" "}
                            {articleMetrics?.readsCount ?? 0} leituras - media real{" "}
                            {formatDuration(articleMetrics?.averageReadSeconds ?? 0)}
                          </span>
                        </>
                      )
                    })()}
                  </div>
                  <div className="dashboard-row-actions">
                    <Link to={`/artigos/${article.id}/editar`} className="button-secondary">
                      <Edit3 size={16} />
                      Editar
                    </Link>
                    <button type="button" className="button-danger" onClick={() => setArticleToDelete(article)}>
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </div>
                </article>
              ))
            : null}
          {!isLoadingMetrics && dashboardTotalPages > 1 ? (
            <div className="pagination-row dashboard-pagination">
              <button type="button" className="button-secondary" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
                Anterior
              </button>
              <span>
                Pagina {page} de {dashboardTotalPages}
              </span>
              <button
                type="button"
                className="button-secondary"
                disabled={page >= dashboardTotalPages}
                onClick={() => setPage((current) => current + 1)}
              >
                Proxima
              </button>
            </div>
          ) : null}
        </section>

        <aside className="surface-panel recent-activity">
          <h2>Atividade Recente</h2>
          {isLoadingActivity ? <StateBlock title="Carregando atividade" /> : null}
          {!isLoadingActivity && activity.length === 0 ? <StateBlock title="Nenhuma atividade ainda" /> : null}
          {!isLoadingActivity
            ? activity.map((item) => (
                <article key={item.id}>
                  <Avatar name={item.author.name} url={item.author.avatarUrl} />
                  <p>
                    <strong>{item.author.name}</strong> comentou em <strong>{item.article.title}</strong>
                    <span>{formatRelativeTime(item.createdAt)}</span>
                  </p>
                </article>
              ))
            : null}
          {!isLoadingActivity && activityMeta.totalPages > 1 ? (
            <div className="pagination-row dashboard-pagination">
              <button
                type="button"
                className="button-secondary"
                disabled={activityPage <= 1}
                onClick={() => setActivityPage((current) => current - 1)}
              >
                Anterior
              </button>
              <span>
                Pagina {activityMeta.page} de {activityMeta.totalPages}
              </span>
              <button
                type="button"
                className="button-secondary"
                disabled={activityPage >= activityMeta.totalPages}
                onClick={() => setActivityPage((current) => current + 1)}
              >
                Proxima
              </button>
            </div>
          ) : null}
        </aside>
      </div>

      <DeleteArticleModal
        article={articleToDelete}
        isDeleting={isDeleting}
        onClose={() => setArticleToDelete(null)}
        onConfirm={handleDelete}
      />
    </section>
  )
}
