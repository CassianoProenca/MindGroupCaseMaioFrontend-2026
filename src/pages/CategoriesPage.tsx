import { useEffect, useState, type FormEvent } from "react"
import { ArrowLeft, Edit3, Plus, Trash2, X } from "lucide-react"
import { Link } from "react-router-dom"

import { Pagination } from "@/components/ui/Pagination"
import { StateBlock } from "@/components/ui/StateBlock"
import { useAuth } from "@/context/AuthContext"
import { getApiErrorMessage } from "@/services/api"
import { createCategory, deleteCategory, listCategories, updateCategory } from "@/services/articles"
import type { Category, PaginationMeta } from "@/types/api"

const perPage = 8

const emptyMeta: PaginationMeta = {
  page: 1,
  perPage,
  total: 0,
  totalPages: 1,
}

export function CategoriesPage() {
  const { token } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(emptyMeta)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [name, setName] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function loadCategories(nextPage = page) {
    setIsLoading(true)
    listCategories({
      page: nextPage,
      perPage,
      search: search.trim() || undefined,
    })
      .then(({ categories, meta }) => {
        setCategories(categories)
        setMeta(meta ?? emptyMeta)
      })
      .catch((error) => setError(getApiErrorMessage(error)))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadCategories(page)
  }, [page, search])

  function handleEdit(category: Category) {
    setEditingCategory(category)
    setName(category.name)
    setError("")
  }

  function handleCancelEdit() {
    setEditingCategory(null)
    setName("")
    setError("")
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!token) {
      return
    }

    setError("")
    setIsSubmitting(true)

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, { name }, token)
      } else {
        await createCategory({ name }, token)
      }

      setName("")
      setEditingCategory(null)
      setPage(1)
      loadCategories(1)
    } catch (error) {
      setError(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(category: Category) {
    if (!token) {
      return
    }

    setError("")

    try {
      await deleteCategory(category.id, token)
      setPage(1)
      loadCategories(1)
    } catch (error) {
      setError(getApiErrorMessage(error))
    }
  }

  function handleSearchChange(nextSearch: string) {
    setSearch(nextSearch)
    setPage(1)
  }

  return (
    <section className="page-container dashboard-page">
      <Link to="/dashboard" className="page-kicker">
        <ArrowLeft size={20} />
        Voltar ao Dashboard
      </Link>
      <div className="page-rule" />

      <div className="dashboard-heading">
        <div>
          <h1 className="page-title">Categorias</h1>
          <p className="page-subtitle">Crie e organize os temas dos artigos</p>
        </div>
      </div>

      <div className="category-admin-grid">
        <form className="surface-panel category-admin-form" onSubmit={handleSubmit}>
          <h2>{editingCategory ? "Editar categoria" : "Nova categoria"}</h2>
          <label className="field-shell">
            <span>Nome</span>
            <input className="text-field" value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <div className="category-form-actions">
            <button type="submit" className="button-primary" disabled={isSubmitting}>
              <Plus size={16} />
              {isSubmitting ? "Salvando..." : editingCategory ? "Salvar" : "Criar"}
            </button>
            {editingCategory ? (
              <button type="button" className="button-secondary" onClick={handleCancelEdit}>
                <X size={16} />
                Cancelar
              </button>
            ) : null}
          </div>
        </form>

        <section className="surface-panel category-list-panel">
          <div className="category-list-heading">
            <h2>Lista de categorias</h2>
            <label className="search-box">
              <input
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Buscar categoria..."
              />
            </label>
          </div>

          {isLoading ? <StateBlock title="Carregando categorias" /> : null}
          {!isLoading && categories.length === 0 ? <StateBlock title="Nenhuma categoria encontrada" /> : null}

          {!isLoading && categories.length > 0 ? (
            <div className="category-table">
              {categories.map((category) => (
                <article key={category.id}>
                  <div>
                    <strong>{category.name}</strong>
                    <span>{category.articlesCount} artigos</span>
                  </div>
                  <div className="category-row-actions">
                    <button type="button" className="button-secondary" onClick={() => handleEdit(category)}>
                      <Edit3 size={16} />
                      Editar
                    </button>
                    <button type="button" className="button-danger" onClick={() => handleDelete(category)}>
                      <Trash2 size={16} />
                      Excluir
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          {!isLoading ? <Pagination page={meta.page} totalPages={meta.totalPages} onChange={setPage} /> : null}
        </section>
      </div>
    </section>
  )
}
