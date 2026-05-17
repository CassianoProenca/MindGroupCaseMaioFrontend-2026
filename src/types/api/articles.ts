import { z } from "zod"

import { paginatedResponse } from "./common"
import { userSchema } from "./auth"

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

export const articleMetricSchema = z.object({
  id: z.number(),
  title: z.string(),
  summary: z.string().nullable().optional(),
  bannerUrl: z.string().nullable(),
  viewsCount: z.number(),
  likesCount: z.number(),
  commentsCount: z.number().optional().default(0),
  readsCount: z.number(),
  totalReadSeconds: z.number(),
  averageReadSeconds: z.number(),
  readingTimeMinutes: z.number(),
  category: z.string().nullable(),
  publishedAt: z.string(),
  updatedAt: z.string(),
})

export const articleResponseSchema = z.object({
  article: articleSchema,
})

export const articlesResponseSchema = paginatedResponse("articles", articleSchema)

export type Article = z.infer<typeof articleSchema>
export type ArticleMetric = z.infer<typeof articleMetricSchema>
export type ArticleResponse = z.infer<typeof articleResponseSchema>
export type ArticlesResponse = z.infer<typeof articlesResponseSchema>
