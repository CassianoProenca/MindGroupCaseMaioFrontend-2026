import { z } from "zod"

import { userSchema } from "./auth"

export const profileSchema = userSchema.extend({
  bio: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const profileResponseSchema = z.object({
  profile: profileSchema,
})

export const profileUpdateResponseSchema = z.object({
  profile: profileSchema,
  token: z.string().min(1),
})

export type Profile = z.infer<typeof profileSchema>
export type ProfileResponse = z.infer<typeof profileResponseSchema>
export type ProfileUpdateResponse = z.infer<typeof profileUpdateResponseSchema>
