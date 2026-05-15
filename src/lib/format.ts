const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333"

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value))
}

export function getReadingTime(content: string) {
  const images = (content.match(/!\[[^\]]*]\([^)]+\)/g)?.length ?? 0) + (content.match(/<img\b[^>]*>/gi)?.length ?? 0)
  const plain = content
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/<img\b[^>]*>/gi, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/[#>*_~[\]()]/g, " ")
  const words = plain.trim().split(/\s+/).filter(Boolean).length
  const seconds = (words / 220) * 60 + images * 12
  return Math.max(1, Math.ceil(seconds / 60))
}

export function formatDuration(seconds: number) {
  if (seconds <= 0) {
    return "0s"
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes === 0) {
    return `${remainingSeconds}s`
  }

  return remainingSeconds > 0 ? `${minutes}min ${remainingSeconds}s` : `${minutes}min`
}

export function getExcerpt(content: string, length = 145) {
  const plain = content.replace(/#+\s/g, "").replace(/\n+/g, " ").trim()
  return plain.length > length ? `${plain.slice(0, length).trim()}...` : plain
}

export function getArticleImage(articleId: number, bannerUrl: string | null) {
  if (!bannerUrl) {
    return `/placeholder-article.svg?id=${articleId}`
  }

  if (/^(https?:)?\/\//.test(bannerUrl) || bannerUrl.startsWith("data:") || bannerUrl.startsWith("blob:")) {
    return bannerUrl
  }

  return new URL(bannerUrl, API_URL).toString()
}

export function getArticleImageFallback(articleId: number) {
  return `/placeholder-article.svg?id=${articleId}`
}
