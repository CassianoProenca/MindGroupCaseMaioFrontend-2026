import {
  authResponseSchema,
  forgotPasswordPayloadSchema,
  loginPayloadSchema,
  meResponseSchema,
  messageResponseSchema,
  registerPayloadSchema,
  resetPasswordPayloadSchema,
  type ForgotPasswordPayload,
  type LoginPayload,
  type RegisterPayload,
  type ResetPasswordPayload,
} from "@/types/api"


import { api, authConfig, normalizeAxiosError, parseApiResponse } from "./api"

export type { ForgotPasswordPayload, LoginPayload, RegisterPayload, ResetPasswordPayload }

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

export async function forgotPassword(payload: ForgotPasswordPayload) {
  try {
    const validatedPayload = forgotPasswordPayloadSchema.parse(payload)
    const response = await api.post("/auth/forgot-password", validatedPayload)
    return parseApiResponse(messageResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}

export async function resetPassword(payload: ResetPasswordPayload) {
  try {
    const validatedPayload = resetPasswordPayloadSchema.parse(payload)
    const response = await api.post("/auth/reset-password", validatedPayload)
    return parseApiResponse(authResponseSchema, response.data)
  } catch (error) {
    normalizeAxiosError(error)
  }
}
