import {
  articlePayloadSchema,
  articleResponseSchema,
  articlesResponseSchema,
} from "@/types/api"

import { api, authConfig, normalizeAxiosError, parseApiResponse } from "./api"

function validateArticleFormData(formData: FormData, requireBanner: boolean) {
  const banner = formData.get("banner")
  const payload = {
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
    banner: banner instanceof File && banner.size > 0 ? banner : undefined,
  }

  const parsed = articlePayloadSchema.safeParse(payload)

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Dados do artigo invalidos.")
  }

  if (requireBanner && !parsed.data.banner) {
    throw new Error("Banner do artigo e obrigatorio.")
  }
}

export async function listArticles() {
  try {
    const response = await api.get("/articles")
    return parseApiResponse(articlesResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function getArticle(id: string | number) {
  try {
    const response = await api.get(`/articles/${id}`)
    return parseApiResponse(articleResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function createArticle(formData: FormData, token: string) {
  try {
    validateArticleFormData(formData, true)
    const response = await api.post("/articles", formData, authConfig(token))
    return parseApiResponse(articleResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function updateArticle(id: string | number, formData: FormData, token: string) {
  try {
    validateArticleFormData(formData, false)
    const response = await api.put(`/articles/${id}`, formData, authConfig(token))
    return parseApiResponse(articleResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function deleteArticle(id: string | number, token: string) {
  try {
    await api.delete(`/articles/${id}`, authConfig(token))
  } catch (error) {
    normalizeAxiosError(error)
  }
}
