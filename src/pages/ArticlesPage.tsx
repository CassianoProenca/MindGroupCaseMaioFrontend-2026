import { useEffect, useState } from "react"

import { ArticleCard } from "@/components/articles/ArticleCard"
import { ArticleFilters } from "@/components/articles/ArticleFilters"
import { ArticleListItem } from "@/components/articles/ArticleListItem"
import { StateBlock } from "@/components/ui/StateBlock"
import { useArticles } from "@/hooks/useArticles"
import { listCategories } from "@/services/articles"
import type { Category } from "@/types/api"

export function ArticlesPage() {
  const [query, setQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [categories, setCategories] = useState<Category[]>([])
  const { articles, meta, isLoading, isFallback } = useArticles({
    categoryId: selectedCategory || undefined,
    page,
    perPage: 6,
    search: query.trim() || undefined,
  })

  useEffect(() => {
    listCategories({ perPage: 50 })
      .then(({ categories }) => setCategories(categories))
      .catch(() => setCategories([]))
  }, [])

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery)
    setPage(1)
  }

  function handleCategoryChange(nextCategory: string) {
    setSelectedCategory(nextCategory)
    setPage(1)
  }

  return (
    <section className="page-container">
      <h1 className="page-title articles-title">Todos os Artigos</h1>
      <p className="page-subtitle">Explore nossa colecao completa de artigos tecnicos</p>
      <ArticleFilters
        categories={categories}
        query={query}
        selectedCategory={selectedCategory}
        viewMode={viewMode}
        onCategoryChange={handleCategoryChange}
        onQueryChange={handleQueryChange}
        onViewModeChange={setViewMode}
      />

      {isFallback ? <p className="fallback-note">Mostrando conteudo local enquanto a API nao responde.</p> : null}

      {isLoading ? <StateBlock title="Carregando artigos">Buscando conteudo atualizado.</StateBlock> : null}

      {!isLoading && articles.length === 0 ? (
        <StateBlock title="Nenhum artigo encontrado">Tente ajustar sua busca.</StateBlock>
      ) : null}

      {!isLoading && articles.length > 0 ? (
        viewMode === "grid" ? (
          <div className="article-grid">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="article-list">
            {articles.map((article) => (
              <ArticleListItem key={article.id} article={article} />
            ))}
          </div>
        )
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
