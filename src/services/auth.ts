import {
  authResponseSchema,
  loginPayloadSchema,
  meResponseSchema,
  registerPayloadSchema,
  type LoginPayload,
  type RegisterPayload,
} from "@/types/api"

import { api, authConfig, normalizeAxiosError, parseApiResponse } from "./api"

export type { LoginPayload, RegisterPayload }

export async function login(payload: LoginPayload) {
  try {
    const validatedPayload = loginPayloadSchema.parse(payload)
    const response = await api.post("/auth/login", validatedPayload)
    return parseApiResponse(authResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function register(payload: RegisterPayload) {
  try {
    const validatedPayload = registerPayloadSchema.parse(payload)
    const response = await api.post("/auth/register", validatedPayload)
    return parseApiResponse(authResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function getMe(token: string) {
  try {
    const response = await api.get("/auth/me", authConfig(token))
    return parseApiResponse(meResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}
