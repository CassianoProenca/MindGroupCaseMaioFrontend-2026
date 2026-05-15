import { Grid2X2, List, Search, SlidersHorizontal } from "lucide-react"

type ArticleFiltersProps = {
  query: string
  viewMode: "grid" | "list"
  onQueryChange: (query: string) => void
  onViewModeChange: (mode: "grid" | "list") => void
}

export function ArticleFilters({ query, viewMode, onQueryChange, onViewModeChange }: ArticleFiltersProps) {
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
        <button type="button" className="category-filter">
          <SlidersHorizontal size={18} />
          Desenvolvimento web
          <span>⌄</span>
        </button>
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
