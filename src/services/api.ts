import type { ApiErrorResponse } from "@/types/api"

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3333"

export const apiUrl = API_URL

type RequestOptions = RequestInit & {
  token?: string | null
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers)

  if (!(options.body instanceof FormData) && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as ApiErrorResponse
    throw new ApiError(payload.message ?? "Nao foi possivel concluir a acao.", response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

export function getBannerUrl(path: string | null) {
  return path ? `${API_URL}${path}` : null
}
