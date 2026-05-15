import { z } from "zod"

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
})

export const authResponseSchema = z.object({
  user: userSchema,
  token: z.string().min(1),
})

export const meResponseSchema = z.object({
  user: userSchema,
})

export const articleSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  bannerUrl: z.string().nullable(),
  publishedAt: z.string(),
  updatedAt: z.string(),
  author: userSchema,
})

export const articlesResponseSchema = z.object({
  articles: z.array(articleSchema),
})

export const articleResponseSchema = z.object({
  article: articleSchema,
})

export const apiErrorResponseSchema = z.object({
  message: z.string().optional(),
})

export const loginPayloadSchema = z.object({
  email: z.string().trim().email("Informe um email valido.").toLowerCase(),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres."),
})

export const registerPayloadSchema = loginPayloadSchema.extend({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres."),
})

export const articlePayloadSchema = z.object({
  title: z.string().trim().min(4, "Titulo deve ter pelo menos 4 caracteres."),
  content: z.string().trim().min(20, "Conteudo deve ter pelo menos 20 caracteres."),
  banner: z.instanceof(File).optional(),
})

export type User = z.infer<typeof userSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>
export type MeResponse = z.infer<typeof meResponseSchema>
export type Article = z.infer<typeof articleSchema>
export type ArticlesResponse = z.infer<typeof articlesResponseSchema>
export type ArticleResponse = z.infer<typeof articleResponseSchema>
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>
export type LoginPayload = z.infer<typeof loginPayloadSchema>
export type RegisterPayload = z.infer<typeof registerPayloadSchema>
