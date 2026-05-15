import { useMemo, useState } from "react"
import { Edit3, FileText, Heart, MessageSquare, Plus, Settings, Trash2, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"

import { DeleteArticleModal } from "@/components/articles/DeleteArticleModal"
import { StateBlock } from "@/components/ui/StateBlock"
import { useAuth } from "@/context/AuthContext"
import { useArticles } from "@/hooks/useArticles"
import { formatDate, getArticleImage, getExcerpt, getReadingTime } from "@/lib/format"
import { deleteArticle } from "@/services/articles"
import type { Article } from "@/types/api"

export function DashboardPage() {
  const { user, token } = useAuth()
  const { articles, isLoading } = useArticles()
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletedArticleIds, setDeletedArticleIds] = useState<number[]>([])

  const dashboardArticles = articles.filter((article) => !deletedArticleIds.includes(article.id))

  const stats = useMemo(() => {
    const totalViews = dashboardArticles.reduce((total, article) => total + article.viewsCount, 0)
    const totalLikes = dashboardArticles.reduce((total, article) => total + article.likesCount, 0)
    const averageReadingTime = Math.round(
      dashboardArticles.reduce((total, article) => total + getReadingTime(article.content), 0) /
        Math.max(1, dashboardArticles.length),
    )

    return [
      { label: "Total de Artigos", value: dashboardArticles.length, icon: FileText },
      { label: "Engajamento", value: totalViews + totalLikes, icon: MessageSquare },
      { label: "Curtidas", value: totalLikes, icon: Heart },
      { label: "Tempo medio de leitura", value: `${averageReadingTime} min`, icon: TrendingUp },
    ]
  }, [dashboardArticles])

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
          <Link to="/artigos/novo" className="button-primary">
            <Plus size={18} />
            Novo Artigo
          </Link>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((item) => {
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
        })}
      </div>

      <div className="dashboard-grid">
        <section className="surface-panel dashboard-list-panel">
          <h2>Meus Artigos</h2>
          {isLoading ? <StateBlock title="Carregando artigos" /> : null}
          {!isLoading && dashboardArticles.length === 0 ? <StateBlock title="Nenhum artigo publicado" /> : null}
          {!isLoading
            ? dashboardArticles.slice(0, 4).map((article) => (
                <article className="dashboard-article" key={article.id}>
                  <img src={getArticleImage(article.id, article.bannerUrl)} alt="" />
                  <div>
                    <h3>{article.title}</h3>
                    <p>{getExcerpt(article.summary || article.content, 85)}</p>
                    <span>
                      {formatDate(article.publishedAt)} - {article.viewsCount} views - {article.likesCount} likes
                    </span>
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
        </section>

        <aside className="surface-panel recent-activity">
          <h2>Atividade Recente</h2>
          {dashboardArticles.slice(0, 3).map((article) => (
            <article key={article.id}>
              <div className="avatar-placeholder">{article.author.name.charAt(0).toUpperCase()}</div>
              <p>
                <strong>{article.author.name}</strong> publicou {article.title}
                <span>{article.category ?? "Sem categoria"} - {formatDate(article.updatedAt)}</span>
              </p>
            </article>
          ))}
          {!isLoading && dashboardArticles.length === 0 ? <StateBlock title="Nenhuma atividade ainda" /> : null}
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
