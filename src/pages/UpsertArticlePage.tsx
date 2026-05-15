import { useEffect, useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"

import { ArticleForm } from "@/components/articles/ArticleForm"
import { StateBlock } from "@/components/ui/StateBlock"
import { useAuth } from "@/context/AuthContext"
import { createArticle, getArticle, updateArticle } from "@/services/articles"
import type { Article } from "@/types/api"

type UpsertArticlePageProps = {
  mode: "create" | "edit"
}

export function UpsertArticlePage({ mode }: UpsertArticlePageProps) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(mode === "edit")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (mode !== "edit" || !id) {
      return
    }

    getArticle(id)
      .then(({ article }) => setArticle(article))
      .catch((error) => setError(error instanceof Error ? error.message : "Nao foi possivel carregar o artigo."))
      .finally(() => setIsLoading(false))
  }, [id, mode])

  async function handleSubmit(formData: FormData) {
    if (!token) {
      return
    }

    setError("")
    setIsSubmitting(true)

    try {
      const response =
        mode === "create" ? await createArticle(formData, token) : await updateArticle(id ?? "", formData, token)
      navigate(`/artigos/${response.article.id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Nao foi possivel salvar o artigo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="page-container narrow-page">
      <Link to="/dashboard" className="page-kicker">
        <ArrowLeft size={20} />
        Voltar ao Dashboard
      </Link>
      <div className="page-rule" />
      <h1 className="page-title">{mode === "create" ? "Criar Novo Artigo" : "Editar Artigo"}</h1>
      <p className="page-subtitle">Compartilhe seu conhecimento com a comunidade</p>
      {isLoading ? (
        <StateBlock title="Carregando artigo" />
      ) : (
        <ArticleForm
          article={article}
          error={error}
          isSubmitting={isSubmitting}
          mode={mode}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  )
}
