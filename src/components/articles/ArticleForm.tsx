import type { FormEvent } from "react"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/Badge"
import { TextArea, TextInput } from "@/components/ui/FormField"
import { getArticleImage, getReadingTime } from "@/lib/format"
import type { Article } from "@/types/api"

type ArticleFormProps = {
  article?: Article | null
  error: string
  isSubmitting: boolean
  mode: "create" | "edit"
  onSubmit: (formData: FormData) => Promise<void>
}

export function ArticleForm({ article, error, isSubmitting, mode, onSubmit }: ArticleFormProps) {
  const [title, setTitle] = useState(article?.title ?? "")
  const [content, setContent] = useState(article?.content ?? "")
  const [file, setFile] = useState<File | null>(null)

  const previewUrl = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file)
    }

    return article ? getArticleImage(article.id, article.bannerUrl) : null
  }, [article, file])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    await onSubmit(formData)
  }

  return (
    <form className="article-form surface-panel" onSubmit={handleSubmit}>
      <TextInput
        name="title"
        label="Titulo do Artigo *"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        required
        minLength={4}
      />
      <TextArea
        name="summary"
        label="Resumo *"
        value="Desenvolvedor Full Stack apaixonado por tecnologia e inovacao."
        readOnly
        hint="Campo visual temporario ate existir resumo no backend"
      />
      <label className="field-shell">
        <span>Categoria *</span>
        <select className="text-field" defaultValue="Desenvolvimento web">
          <option>Desenvolvimento web</option>
        </select>
      </label>
      <label className="field-shell">
        <span>Imagem de Capa {mode === "create" ? "*" : ""}</span>
        <input
          className="text-field file-field"
          name="banner"
          type="file"
          accept="image/*"
          required={mode === "create"}
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
        {previewUrl ? <img className="banner-preview" src={previewUrl} alt="" /> : null}
      </label>
      <div className="tags-field">
        <TextInput label="Tags" placeholder="Adicionar tags" />
        <div>
          <Badge>Typescript</Badge>
          <Badge>Backend</Badge>
          <Badge>IA</Badge>
        </div>
      </div>
      <TextArea
        name="content"
        label="Conteudo do Artigo *"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        required
        minLength={20}
      />
      <small className="article-counter">
        {content.length}/8000 caracteres • {content.trim().split(/\s+/).filter(Boolean).length} palavras •{" "}
        {getReadingTime(content)} minutos de leitura
      </small>
      {error ? <p className="form-error">{error}</p> : null}
      <div className="form-actions-row">
        <button type="submit" className="button-primary" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : mode === "create" ? "Publicar Artigo" : "Salvar Alteracoes"}
        </button>
        <Link to="/dashboard" className="button-secondary">
          Cancelar
        </Link>
      </div>
    </form>
  )
}
