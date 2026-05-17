import {
  dashboardMetricsSchema,
  profilePayloadSchema,
  profileResponseSchema,
  profileUpdateResponseSchema,
  recentActivityResponseSchema,
  type ProfilePayload,
} from "@/types/api"

import { api, authConfig, normalizeAxiosError, parseApiResponse } from "./api"

export async function getMyProfile(token: string) {
  try {
    const response = await api.get("/profile/me", authConfig(token))
    return parseApiResponse(profileResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function updateMyProfile(payload: ProfilePayload, token: string) {
  try {
    const validatedPayload = profilePayloadSchema.parse(payload)
    const response = await api.put("/profile/me", validatedPayload, authConfig(token))
    return parseApiResponse(profileUpdateResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function getMyDashboardMetrics(token: string) {
  try {
    const response = await api.get("/profile/me/dashboard", authConfig(token))
    return parseApiResponse(dashboardMetricsSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

type RecentActivityParams = {
  page?: number
  perPage?: number
}

export async function getMyRecentActivity(token: string, params: RecentActivityParams = {}) {
  try {
    const response = await api.get("/profile/me/recent-activity", {
      ...authConfig(token),
      params: {
        page: params.page ?? 1,
        perPage: params.perPage ?? 3,
      },
    })
    return parseApiResponse(recentActivityResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}
