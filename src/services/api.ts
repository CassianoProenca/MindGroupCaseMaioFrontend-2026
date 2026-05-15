import axios, { AxiosError, type AxiosRequestConfig } from "axios"
import type { z } from "zod"
import { ZodError } from "zod"

import { apiErrorResponseSchema } from "@/types/api"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333"

export const apiUrl = API_URL

export const api = axios.create({
  baseURL: API_URL,
})

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export function parseApiResponse<TSchema extends z.ZodType>(schema: TSchema, data: unknown) {
  const parsed = schema.safeParse(data)

  if (!parsed.success) {
    throw new ApiError("A API retornou dados em um formato inesperado.", 500)
  }

  return parsed.data as z.infer<TSchema>
}

export function getApiErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof AxiosError) {
    const payload = apiErrorResponseSchema.safeParse(error.response?.data)
    return payload.data?.message ?? "Nao foi possivel concluir a acao."
  }

  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Dados invalidos."
  }

  if (error instanceof Error) {
    return error.message
  }

  return "Nao foi possivel concluir a acao."
}

export function normalizeAxiosError(error: unknown): never {
  if (error instanceof ApiError) {
    throw error
  }

  if (error instanceof AxiosError) {
    const payload = apiErrorResponseSchema.safeParse(error.response?.data)
    throw new ApiError(payload.data?.message ?? "Nao foi possivel concluir a acao.", error.response?.status ?? 500)
  }

  if (error instanceof ZodError) {
    throw new ApiError(error.issues[0]?.message ?? "Dados invalidos.", 400)
  }

  if (error instanceof Error) {
    throw new ApiError(error.message, 400)
  }

  throw new ApiError("Nao foi possivel concluir a acao.", 500)
}

export function authConfig(token: string): AxiosRequestConfig {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
}

export function authConfigWithFile(token: string): AxiosRequestConfig {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export function getBannerUrl(path: string | null) {
  return path ? `${API_URL}${path}` : null
}
