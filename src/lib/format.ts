export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}

export function getReadingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 180))
}

export function getExcerpt(content: string, length = 145) {
  const plain = content.replace(/#+\s/g, "").replace(/\n+/g, " ").trim()
  return plain.length > length ? `${plain.slice(0, length).trim()}...` : plain
}

export function getArticleImage(articleId: number, bannerUrl: string | null) {
  return bannerUrl ?? `/placeholder-article.svg?id=${articleId}`
}
