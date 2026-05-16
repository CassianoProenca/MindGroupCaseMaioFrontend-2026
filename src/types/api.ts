import { z } from "zod"

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  bio: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  role: z.string().optional(),
})

export const authResponseSchema = z.object({
  user: userSchema,
  token: z.string().min(1),
})

export const meResponseSchema = z.object({
  user: userSchema,
})

export const articleSchema = z.object({
  id: z.number(),
  title: z.string(),
  summary: z.string().nullable().optional(),
  content: z.string(),
  categoryId: z.number().nullable().optional(),
  category: z.string().nullable().optional(),
  bannerUrl: z.string().nullable(),
  viewsCount: z.number().optional().default(0),
  likesCount: z.number().optional().default(0),
  commentsCount: z.number().optional().default(0),
  readingTimeMinutes: z.number().optional(),
  publishedAt: z.string(),
  updatedAt: z.string(),
  author: userSchema,
  tags: z.array(z.string()).optional().default([]),
})

export const paginationMetaSchema = z.object({
  page: z.number(),
  perPage: z.number(),
  total: z.number(),
  totalPages: z.number(),
})

export const articlesResponseSchema = z.object({
  articles: z.array(articleSchema),
  meta: paginationMetaSchema.optional(),
})

export const articleResponseSchema = z.object({
  article: articleSchema,
})

export const apiErrorResponseSchema = z.object({
  message: z.string().optional(),
})

export const commentSchema = z.object({
  id: z.number(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: userSchema,
})

export const commentsResponseSchema = z.object({
  comments: z.array(commentSchema),
  meta: paginationMetaSchema.optional(),
})

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  articlesCount: z.number(),
})

export const categoriesResponseSchema = z.object({
  categories: z.array(categorySchema),
  meta: paginationMetaSchema.optional(),
})

export const categoryResponseSchema = z.object({
  category: categorySchema,
})

export const commentResponseSchema = z.object({
  comment: commentSchema,
})

export const profileSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  bio: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const profileResponseSchema = z.object({
  profile: profileSchema,
})

export const dashboardMetricsSchema = z.object({
  metrics: z.object({
    totals: z.object({
      articles: z.number(),
      views: z.number(),
      likes: z.number(),
      reads: z.number(),
      totalReadSeconds: z.number(),
      engagement: z.number(),
      averageReadSeconds: z.number(),
      averageReadingTimeMinutes: z.number(),
    }),
    articleMetrics: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        summary: z.string().nullable().optional(),
        bannerUrl: z.string().nullable(),
        viewsCount: z.number(),
        likesCount: z.number(),
        readsCount: z.number(),
        totalReadSeconds: z.number(),
        averageReadSeconds: z.number(),
        readingTimeMinutes: z.number(),
        category: z.string().nullable(),
        publishedAt: z.string(),
        updatedAt: z.string(),
      }),
    ),
    topArticles: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        summary: z.string().nullable().optional(),
        bannerUrl: z.string().nullable(),
        viewsCount: z.number(),
        likesCount: z.number(),
        readsCount: z.number(),
        totalReadSeconds: z.number(),
        averageReadSeconds: z.number(),
        readingTimeMinutes: z.number(),
        category: z.string().nullable(),
        publishedAt: z.string(),
        updatedAt: z.string(),
      }),
    ),
  }),
})

export const recentActivitySchema = z.object({
  id: z.number(),
  content: z.string(),
  createdAt: z.string(),
  author: z.object({
    id: z.number(),
    name: z.string(),
    avatarUrl: z.string().nullable().optional(),
  }),
  article: z.object({ id: z.number(), title: z.string() }),
})

export const recentActivityResponseSchema = z.object({
  activity: z.array(recentActivitySchema),
  meta: paginationMetaSchema.optional(),
})

export const engagementResponseSchema = z.object({
  article: z.object({
    id: z.number(),
    viewsCount: z.number(),
    likesCount: z.number(),
  }),
  liked: z.boolean().optional(),
})

export const loginPayloadSchema = z.object({
  email: z.string().trim().email("Informe um email valido.").toLowerCase(),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres."),
})

export const registerPayloadSchema = loginPayloadSchema.extend({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres."),
})

export const articlePayloadSchema = z.object({
  title: z.string().trim().min(4, "Titulo deve ter pelo menos 4 caracteres."),
  summary: z.string().trim().max(280, "Resumo deve ter no maximo 280 caracteres.").optional(),
  content: z.string().trim().min(20, "Conteudo deve ter pelo menos 20 caracteres."),
  category: z.string().trim().max(120, "Categoria deve ter no maximo 120 caracteres.").optional(),
  tags: z.string().optional(),
  banner: z.instanceof(File).optional(),
})

export const commentPayloadSchema = z.object({
  content: z.string().trim().min(3, "Comentario deve ter pelo menos 3 caracteres.").max(1000),
})

export const profilePayloadSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres."),
  bio: z.string().trim().max(500, "Bio deve ter no maximo 500 caracteres.").optional(),
  avatarUrl: z.string().trim().url("URL de avatar invalida.").optional().or(z.literal("")),
})

export type User = z.infer<typeof userSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>
export type MeResponse = z.infer<typeof meResponseSchema>
export type Article = z.infer<typeof articleSchema>
export type PaginationMeta = z.infer<typeof paginationMetaSchema>
export type ArticlesResponse = z.infer<typeof articlesResponseSchema>
export type ArticleResponse = z.infer<typeof articleResponseSchema>
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>
export type Comment = z.infer<typeof commentSchema>
export type CommentsResponse = z.infer<typeof commentsResponseSchema>
export type Category = z.infer<typeof categorySchema>
export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>
export type CategoryResponse = z.infer<typeof categoryResponseSchema>
export type CommentResponse = z.infer<typeof commentResponseSchema>
export type Profile = z.infer<typeof profileSchema>
export type ProfileResponse = z.infer<typeof profileResponseSchema>
export type DashboardMetricsResponse = z.infer<typeof dashboardMetricsSchema>
export type RecentActivity = z.infer<typeof recentActivitySchema>
export type RecentActivityResponse = z.infer<typeof recentActivityResponseSchema>
export type EngagementResponse = z.infer<typeof engagementResponseSchema>
export type LoginPayload = z.infer<typeof loginPayloadSchema>
export type RegisterPayload = z.infer<typeof registerPayloadSchema>
export type CommentPayload = z.infer<typeof commentPayloadSchema>
export type ProfilePayload = z.infer<typeof profilePayloadSchema>
