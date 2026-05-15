import { profilePayloadSchema, profileResponseSchema, type ProfilePayload } from "@/types/api"

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
    return parseApiResponse(profileResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}
