/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { ArticleCard } from "@/components/articles/ArticleCard"
import { StateBlock } from "@/components/ui/StateBlock"
import { useAuth } from "@/context/AuthContext"
import { listSavedArticles } from "@/services/articles"
import type { Article, PaginationMeta } from "@/types/api"

const perPage = 6

const emptyMeta: PaginationMeta = {
  page: 1,
  perPage,
  total: 0,
  totalPages: 1,
}

export function SavedArticlesPage() {
  const { token } = useAuth()
  const [articles, setArticles] = useState<Article[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(emptyMeta)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      return
    }

    let isMounted = true
    setIsLoading(true)

    listSavedArticles(token, { page, perPage })
      .then((response) => {
        if (!isMounted || !response) {
          return
        }
        setArticles(response.articles)
        setMeta(response.meta ?? emptyMeta)
      })
      .catch(() => {
        if (isMounted) {
          setArticles([])
          setMeta(emptyMeta)
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
  }, [token, page])

  return (
    <section className="page-container">
      <h1 className="page-title articles-title">Salvos</h1>
      <p className="page-subtitle">Artigos que voce marcou para ler depois.</p>

      {isLoading ? <StateBlock title="Carregando artigos">Buscando seus artigos salvos.</StateBlock> : null}

      {!isLoading && articles.length === 0 ? (
        <StateBlock title="Nenhum artigo salvo">
          Use o icone de marcador na pagina do artigo para guardar leituras. <Link to="/artigos">Explorar artigos</Link>.
        </StateBlock>
      ) : null}

      {!isLoading && articles.length > 0 ? (
        <div className="article-grid">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : null}

      {!isLoading && meta.totalPages > 1 ? (
        <div className="pagination-row">
          <button type="button" className="button-secondary" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
            Anterior
          </button>
          <span>
            Pagina {meta.page} de {meta.totalPages}
          </span>
          <button
            type="button"
            className="button-secondary"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Proxima
          </button>
        </div>
      ) : null}
    </section>
  )
}
