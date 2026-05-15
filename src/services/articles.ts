import type { ArticleResponse, ArticlesResponse } from "@/types/api"

import { apiRequest } from "./api"

export function listArticles() {
  return apiRequest<ArticlesResponse>("/articles")
}

export function getArticle(id: string | number) {
  return apiRequest<ArticleResponse>(`/articles/${id}`)
}

export function createArticle(formData: FormData, token: string) {
  return apiRequest<ArticleResponse>("/articles", {
    method: "POST",
    body: formData,
    token,
  })
}

export function updateArticle(id: string | number, formData: FormData, token: string) {
  return apiRequest<ArticleResponse>(`/articles/${id}`, {
    method: "PUT",
    body: formData,
    token,
  })
}

export function deleteArticle(id: string | number, token: string) {
  return apiRequest<void>(`/articles/${id}`, {
    method: "DELETE",
    token,
  })
}
