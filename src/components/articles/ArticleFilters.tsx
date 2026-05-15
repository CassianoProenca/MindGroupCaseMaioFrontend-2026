import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, Grid2X2, List, Search, SlidersHorizontal } from "lucide-react"

import type { Category } from "@/types/api"

type ArticleFiltersProps = {
  categories: Category[]
  query: string
  selectedCategory: string
  viewMode: "grid" | "list"
  onCategoryChange: (category: string) => void
  onQueryChange: (query: string) => void
  onViewModeChange: (mode: "grid" | "list") => void
}

export function ArticleFilters({
  categories,
  query,
  selectedCategory,
  viewMode,
  onCategoryChange,
  onQueryChange,
  onViewModeChange,
}: ArticleFiltersProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const categoryFilterRef = useRef<HTMLDivElement>(null)
  const selectedCategoryLabel = useMemo(() => {
    return categories.find((category) => String(category.id) === selectedCategory)?.name ?? "Todos os temas"
  }, [categories, selectedCategory])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!categoryFilterRef.current?.contains(event.target as Node)) {
        setIsCategoryOpen(false)
      }
    }

    document.addEventListener("pointerdown", handlePointerDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
    }
  }, [])

  function handleCategorySelect(category: string) {
    onCategoryChange(category)
    setIsCategoryOpen(false)
  }

  return (
    <div className="article-filters">
      <label className="search-box">
        <Search size={18} />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Buscar artigos..."
        />
      </label>

      <div className="filter-actions">
        <div className="category-filter" ref={categoryFilterRef}>
          <button
            type="button"
            className="category-filter-trigger"
            aria-expanded={isCategoryOpen}
            aria-haspopup="listbox"
            onClick={() => setIsCategoryOpen((current) => !current)}
          >
            <SlidersHorizontal size={18} />
            <span>{selectedCategoryLabel}</span>
            <ChevronDown size={16} />
          </button>
          {isCategoryOpen ? (
            <div className="category-filter-menu" role="listbox" aria-label="Filtrar por tema">
              <button
                type="button"
                role="option"
                aria-selected={!selectedCategory}
                className={!selectedCategory ? "active" : ""}
                onClick={() => handleCategorySelect("")}
              >
                Todos os temas
              </button>
              {categories.map((category) => {
                const categoryId = String(category.id)
                return (
                  <button
                    type="button"
                    role="option"
                    aria-selected={selectedCategory === categoryId}
                    className={selectedCategory === categoryId ? "active" : ""}
                    key={category.id}
                    onClick={() => handleCategorySelect(categoryId)}
                  >
                    {category.name}
                  </button>
                )
              })}
            </div>
          ) : null}
        </div>
        <div className="view-switch" aria-label="Modo de visualizacao">
          <button
            type="button"
            aria-label="Ver em cards"
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => onViewModeChange("grid")}
          >
            <Grid2X2 size={20} />
          </button>
          <button
            type="button"
            aria-label="Ver em lista"
            className={viewMode === "list" ? "active" : ""}
            onClick={() => onViewModeChange("list")}
          >
            <List size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
