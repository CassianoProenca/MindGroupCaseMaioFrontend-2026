export type User = {
  id: number
  name: string
  email: string
}

export type AuthResponse = {
  user: User
  token: string
}

export type Article = {
  id: number
  title: string
  content: string
  bannerUrl: string | null
  publishedAt: string
  updatedAt: string
  author: User
}

export type ArticlesResponse = {
  articles: Article[]
}

export type ArticleResponse = {
  article: Article
}

export type ApiErrorResponse = {
  message?: string
}
