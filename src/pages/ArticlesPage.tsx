import { useMemo, useState } from "react"

import { ArticleCard } from "@/components/articles/ArticleCard"
import { ArticleFilters } from "@/components/articles/ArticleFilters"
import { ArticleListItem } from "@/components/articles/ArticleListItem"
import { StateBlock } from "@/components/ui/StateBlock"
import { useArticles } from "@/hooks/useArticles"

export function ArticlesPage() {
  const [query, setQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { articles, isLoading, isFallback } = useArticles()

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return articles
    }

    return articles.filter((article) =>
      `${article.title} ${article.content} ${article.author.name}`.toLowerCase().includes(normalizedQuery),
    )
  }, [articles, query])

  return (
    <section className="page-container">
      <h1 className="page-title articles-title">Todos os Artigos</h1>
      <p className="page-subtitle">Explore nossa colecao completa de artigos tecnicos</p>
      <ArticleFilters query={query} viewMode={viewMode} onQueryChange={setQuery} onViewModeChange={setViewMode} />

      {isFallback ? <p className="fallback-note">Mostrando conteudo local enquanto a API nao responde.</p> : null}

      {isLoading ? <StateBlock title="Carregando artigos">Buscando conteudo atualizado.</StateBlock> : null}

      {!isLoading && filteredArticles.length === 0 ? (
        <StateBlock title="Nenhum artigo encontrado">Tente ajustar sua busca.</StateBlock>
      ) : null}

      {!isLoading && filteredArticles.length > 0 ? (
        viewMode === "grid" ? (
          <div className="article-grid">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="article-list">
            {filteredArticles.map((article) => (
              <ArticleListItem key={article.id} article={article} />
            ))}
          </div>
        )
      ) : null}
    </section>
  )
}
