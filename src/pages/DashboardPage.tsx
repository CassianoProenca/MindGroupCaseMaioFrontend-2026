import { useEffect, useMemo, useState, type UIEvent } from "react"
import { Edit3, FileText, FolderTree, Heart, MessageSquare, Plus, Settings, Trash2, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"

import { DeleteArticleModal } from "@/components/articles/DeleteArticleModal"
import { Avatar } from "@/components/ui/Avatar"
import { StateBlock } from "@/components/ui/StateBlock"
import { useAuth } from "@/context/AuthContext"
import { formatDate, formatRelativeTime, getArticleImage, getArticleImageFallback, getExcerpt } from "@/lib/format"
import { deleteArticle } from "@/services/articles"
import { getApiErrorMessage } from "@/services/api"
import { getMyDashboardMetrics, getMyRecentActivity } from "@/services/profile"
import type { DashboardMetricsResponse, RecentActivity } from "@/types/api"

type DashboardArticle = DashboardMetricsResponse["metrics"]["articleMetrics"][number]

const ACTIVITY_PER_PAGE = 5

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
  const [activityTotal, setActivityTotal] = useState(0)
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

    getMyRecentActivity(token, { page: 1, perPage: ACTIVITY_PER_PAGE })
      .then(({ activity: nextActivity, meta }) => {
        if (isMounted) {
          setActivity(nextActivity)
          setActivityTotal(meta?.total ?? nextActivity.length)
          setActivityPage(1)
        }
      })
      .catch(() => {
        if (isMounted) {
          setActivity([])
          setActivityTotal(0)
          setActivityPage(1)
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
  }, [token, deletedArticleIds])

  async function handleLoadMoreActivity() {
    if (!token || isLoadingActivity || activity.length >= activityTotal) {
      return
    }

    setIsLoadingActivity(true)

    try {
      const nextPage = activityPage + 1
      const response = await getMyRecentActivity(token, { page: nextPage, perPage: ACTIVITY_PER_PAGE })
      setActivity((current) => [...current, ...response.activity])
      setActivityTotal(response.meta?.total ?? activityTotal)
      setActivityPage(nextPage)
    } finally {
      setIsLoadingActivity(false)
    }
  }

  function handleActivityScroll(event: UIEvent<HTMLDivElement>) {
    const target = event.currentTarget
    const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight
    if (distanceToBottom < 100) {
      handleLoadMoreActivity()
    }
  }

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
                          <span className="dashboard-article-meta">
                            <span>{formatDate(article.publishedAt)}</span>
                            <span aria-hidden="true">&bull;</span>
                            <span>
                              <MessageSquare size={14} />
                              {articleMetrics?.commentsCount ?? article.commentsCount}
                            </span>
                            <span aria-hidden="true">&bull;</span>
                            <span>
                              <Heart size={14} />
                              {articleMetrics?.likesCount ?? article.likesCount}
                            </span>
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
          <div className="recent-activity-body" onScroll={handleActivityScroll}>
            {isLoadingActivity && activity.length === 0 ? <StateBlock title="Carregando atividade" /> : null}
            {!isLoadingActivity && activity.length === 0 ? <StateBlock title="Nenhuma atividade ainda" /> : null}
            {activity.map((item) => (
              <article key={item.id}>
                <Avatar name={item.author.name} url={item.author.avatarUrl} />
                <p>
                  <strong>{item.author.name}</strong> comentou em <strong>{item.article.title}</strong>
                  <span>{formatRelativeTime(item.createdAt)}</span>
                </p>
              </article>
            ))}
            {isLoadingActivity && activity.length > 0 ? (
              <div className="recent-activity-loading">Carregando...</div>
            ) : null}
            {!isLoadingActivity && activity.length > 0 && activity.length >= activityTotal ? (
              <div className="recent-activity-loading">Sem mais atividades.</div>
            ) : null}
          </div>
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
