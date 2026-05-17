import { useEffect, useState } from "react"

import { ArticleCard } from "@/components/articles/ArticleCard"
import { ArticleFilters } from "@/components/articles/ArticleFilters"
import { ArticleListItem } from "@/components/articles/ArticleListItem"
import { Pagination } from "@/components/ui/Pagination"
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
  const { articles, meta, isLoading } = useArticles({
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

      {!isLoading ? <Pagination page={meta.page} totalPages={meta.totalPages} onChange={setPage} /> : null}
    </section>
  )
}
