import { useEffect, useMemo, useState, type UIEvent } from "react"
import { FolderTree, Plus, Settings } from "lucide-react"
import { Link } from "react-router-dom"

import { DeleteArticleModal } from "@/components/articles/DeleteArticleModal"
import { DashboardActivity } from "@/components/dashboard/DashboardActivity"
import { DashboardArticles, type DashboardArticle } from "@/components/dashboard/DashboardArticles"
import { DashboardStats } from "@/components/dashboard/DashboardStats"
import { useAuth } from "@/context/AuthContext"
import { deleteArticle } from "@/services/articles"
import { getApiErrorMessage } from "@/services/api"
import { getMyDashboardMetrics, getMyRecentActivity } from "@/services/profile"
import type { DashboardMetricsResponse, RecentActivity } from "@/types/api"

const ARTICLES_PER_PAGE = 4
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
  const dashboardTotalPages = Math.max(1, Math.ceil(dashboardArticles.length / ARTICLES_PER_PAGE))
  const visibleDashboardArticles = dashboardArticles.slice((page - 1) * ARTICLES_PER_PAGE, page * ARTICLES_PER_PAGE)

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

      <DashboardStats
        totals={dashboardMetrics?.totals ?? null}
        isLoading={isLoadingMetrics}
        errorMessage={metricsError}
      />

      <div className="dashboard-grid">
        <DashboardArticles
          articles={dashboardArticles}
          visibleArticles={visibleDashboardArticles}
          page={page}
          totalPages={dashboardTotalPages}
          isLoading={isLoadingMetrics}
          onPageChange={setPage}
          onDelete={setArticleToDelete}
        />
        <DashboardActivity
          items={activity}
          total={activityTotal}
          isLoading={isLoadingActivity}
          onScroll={handleActivityScroll}
        />
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
