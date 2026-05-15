import type { ArticleResponse, ArticlesResponse } from "@/types/api"

import { apiRequest } from "./api"

export function listArticles() {
  return apiRequest<ArticlesResponse>("/articles")
}

export function getArticle(id: string | number) {
  return apiRequest<ArticleResponse>(`/articles/${id}`)
}
