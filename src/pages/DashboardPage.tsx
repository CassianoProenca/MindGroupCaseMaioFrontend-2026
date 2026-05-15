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
  const [visibleArticles, setVisibleArticles] = useState(articles)

  const dashboardArticles = visibleArticles.length ? visibleArticles : articles

  const stats = useMemo(
    () => [
      { label: "Total de Artigos", value: dashboardArticles.length, icon: FileText },
      { label: "Engajamento", value: "4", icon: MessageSquare },
      { label: "Curtidas", value: "20", icon: Heart },
      {
        label: "Tempo medio de leitura",
        value: `${Math.round(
          dashboardArticles.reduce((total, article) => total + getReadingTime(article.content), 0) /
            Math.max(1, dashboardArticles.length),
        )} min`,
        icon: TrendingUp,
      },
    ],
    [dashboardArticles],
  )

  async function handleDelete() {
    if (!articleToDelete || !token) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteArticle(articleToDelete.id, token)
      setVisibleArticles((current) => current.filter((article) => article.id !== articleToDelete.id))
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
          {!isLoading
            ? dashboardArticles.slice(0, 4).map((article) => (
                <article className="dashboard-article" key={article.id}>
                  <img src={getArticleImage(article.id, article.bannerUrl)} alt="" />
                  <div>
                    <h3>{article.title}</h3>
                    <p>{getExcerpt(article.content, 85)}</p>
                    <span>{formatDate(article.publishedAt)} • 💬 2 • ♡ 1</span>
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
          {[1, 2, 3].map((item) => (
            <article key={item}>
              <div className="avatar-placeholder">M</div>
              <p>
                <strong>Marie Smith</strong> comentou em O Futuro da Inteligencia Artificial em 2025
                <span>5 min atras</span>
              </p>
            </article>
          ))}
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
