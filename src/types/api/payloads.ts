import { z } from "zod"

export const loginPayloadSchema = z.object({
  email: z.string().trim().email("Informe um email valido.").toLowerCase(),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres."),
})

export const registerPayloadSchema = loginPayloadSchema.extend({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres."),
})

export const articlePayloadSchema = z.object({
  title: z.string().trim().min(4, "Titulo deve ter pelo menos 4 caracteres."),
  summary: z.string().trim().max(280, "Resumo deve ter no maximo 280 caracteres.").optional(),
  content: z.string().trim().min(20, "Conteudo deve ter pelo menos 20 caracteres."),
  category: z.string().trim().max(120, "Categoria deve ter no maximo 120 caracteres.").optional(),
  tags: z.string().optional(),
  banner: z.instanceof(File).optional(),
})

export const commentPayloadSchema = z.object({
  content: z.string().trim().min(3, "Comentario deve ter pelo menos 3 caracteres.").max(1000),
})

export const profilePayloadSchema = z.object({
  name: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres."),
  bio: z.string().trim().max(500, "Bio deve ter no maximo 500 caracteres.").optional(),
  avatarUrl: z.string().trim().url("URL de avatar invalida.").optional().or(z.literal("")),
})

export type LoginPayload = z.infer<typeof loginPayloadSchema>
export type RegisterPayload = z.infer<typeof registerPayloadSchema>
export type ArticlePayload = z.infer<typeof articlePayloadSchema>
export type CommentPayload = z.infer<typeof commentPayloadSchema>
export type ProfilePayload = z.infer<typeof profilePayloadSchema>
