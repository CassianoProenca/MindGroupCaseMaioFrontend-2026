import type { AuthResponse, User } from "@/types/api"

import { apiRequest } from "./api"

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = LoginPayload & {
  name: string
}

export function login(payload: LoginPayload) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function register(payload: RegisterPayload) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export function getMe(token: string) {
  return apiRequest<{ user: User }>("/auth/me", { token })
}
