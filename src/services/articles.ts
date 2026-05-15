import {
  commentPayloadSchema,
  commentResponseSchema,
  commentsResponseSchema,
  engagementResponseSchema,
  articlePayloadSchema,
  articleResponseSchema,
  articlesResponseSchema,
  type CommentPayload,
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

export async function listComments(articleId: string | number) {
  try {
    const response = await api.get(`/articles/${articleId}/comments`)
    return parseApiResponse(commentsResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function createComment(articleId: string | number, payload: CommentPayload, token: string) {
  try {
    const validatedPayload = commentPayloadSchema.parse(payload)
    const response = await api.post(`/articles/${articleId}/comments`, validatedPayload, authConfig(token))
    return parseApiResponse(commentResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function registerArticleView(articleId: string | number) {
  try {
    const response = await api.post(`/articles/${articleId}/view`)
    return parseApiResponse(engagementResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function likeArticle(articleId: string | number, token: string) {
  try {
    const response = await api.post(`/articles/${articleId}/like`, undefined, authConfig(token))
    return parseApiResponse(engagementResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function unlikeArticle(articleId: string | number, token: string) {
  try {
    const response = await api.delete(`/articles/${articleId}/like`, authConfig(token))
    return parseApiResponse(engagementResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}
