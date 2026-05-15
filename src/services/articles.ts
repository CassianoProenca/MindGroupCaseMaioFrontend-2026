import {
  commentPayloadSchema,
  commentResponseSchema,
  commentsResponseSchema,
  categoriesResponseSchema,
  categoryResponseSchema,
  engagementResponseSchema,
  articlePayloadSchema,
  articleResponseSchema,
  articlesResponseSchema,
  type CommentPayload,
} from "@/types/api"

import { api, authConfig, authConfigWithFile, normalizeAxiosError, parseApiResponse } from "./api"

function validateArticleFormData(formData: FormData, requireBanner: boolean) {
  const banner = formData.get("banner")
  const payload = {
    title: String(formData.get("title") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    content: String(formData.get("content") ?? ""),
    category: String(formData.get("category") ?? ""),
    tags: String(formData.get("tags") ?? ""),
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

type ListArticlesParams = {
  categoryId?: string
  page?: number
  perPage?: number
  search?: string
}

type ListCommentsParams = {
  page?: number
  perPage?: number
  search?: string
}

type ListCategoriesParams = {
  page?: number
  perPage?: number
  search?: string
}

type CategoryPayload = {
  name: string
}

type ArticleReadPayload = {
  durationSeconds: number
  readerId: string
}

export async function listCategories(params: ListCategoriesParams = {}) {
  try {
    const response = await api.get("/articles/categories", { params })
    return parseApiResponse(categoriesResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function createCategory(payload: CategoryPayload, token: string) {
  try {
    const response = await api.post("/articles/categories", payload, authConfig(token))
    return parseApiResponse(categoryResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function updateCategory(id: string | number, payload: CategoryPayload, token: string) {
  try {
    const response = await api.put(`/articles/categories/${id}`, payload, authConfig(token))
    return parseApiResponse(categoryResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function deleteCategory(id: string | number, token: string) {
  try {
    await api.delete(`/articles/categories/${id}`, authConfig(token))
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function listArticles(params: ListArticlesParams = {}) {
  try {
    const response = await api.get("/articles", { params })
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
    const response = await api.post("/articles", formData, authConfigWithFile(token))
    return parseApiResponse(articleResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function updateArticle(id: string | number, formData: FormData, token: string) {
  try {
    validateArticleFormData(formData, false)
    const response = await api.put(`/articles/${id}`, formData, authConfigWithFile(token))
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

export async function listComments(articleId: string | number, params: ListCommentsParams = {}) {
  try {
    const response = await api.get(`/articles/${articleId}/comments`, { params })
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

export async function registerArticleView(articleId: string | number, readerId: string) {
  try {
    const response = await api.post(`/articles/${articleId}/view`, { readerId })
    return parseApiResponse(engagementResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function registerArticleRead(articleId: string | number, payload: ArticleReadPayload, token?: string | null) {
  try {
    await api.post(`/articles/${articleId}/read`, payload, token ? authConfig(token) : undefined)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function getArticleLikeStatus(articleId: string | number, token: string) {
  try {
    const response = await api.get(`/articles/${articleId}/like`, authConfig(token))
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
