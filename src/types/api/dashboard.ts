import { z } from "zod"

import { articleMetricSchema } from "./articles"
import { paginatedResponse } from "./common"

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
    articleMetrics: z.array(articleMetricSchema),
    topArticles: z.array(articleMetricSchema),
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

export const recentActivityResponseSchema = paginatedResponse("activity", recentActivitySchema)

export const engagementResponseSchema = z.object({
  article: z.object({
    id: z.number(),
    viewsCount: z.number(),
    likesCount: z.number(),
  }),
  liked: z.boolean().optional(),
})

export type DashboardMetricsResponse = z.infer<typeof dashboardMetricsSchema>
export type RecentActivity = z.infer<typeof recentActivitySchema>
export type RecentActivityResponse = z.infer<typeof recentActivityResponseSchema>
export type EngagementResponse = z.infer<typeof engagementResponseSchema>
