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

export type Profile = z.infer<typeof profileSchema>
export type ProfileResponse = z.infer<typeof profileResponseSchema>
