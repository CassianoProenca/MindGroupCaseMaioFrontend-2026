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

export const messageResponseSchema = z.object({
  message: z.string(),
})

export type User = z.infer<typeof userSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>
export type MeResponse = z.infer<typeof meResponseSchema>
export type MessageResponse = z.infer<typeof messageResponseSchema>
