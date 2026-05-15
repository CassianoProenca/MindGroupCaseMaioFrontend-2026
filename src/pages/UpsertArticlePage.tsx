type UpsertArticlePageProps = {
  mode: "create" | "edit"
}

export function UpsertArticlePage({ mode }: UpsertArticlePageProps) {
  return <section className="page-container">{mode === "create" ? "Novo artigo" : "Editar artigo"}</section>
}
