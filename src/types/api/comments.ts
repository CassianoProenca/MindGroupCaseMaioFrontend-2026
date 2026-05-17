import { z } from "zod"

import { paginatedResponse } from "./common"
import { userSchema } from "./auth"

export const commentSchema = z.object({
  id: z.number(),
  content: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  author: userSchema,
})

export const commentResponseSchema = z.object({
  comment: commentSchema,
})

export const commentsResponseSchema = paginatedResponse("comments", commentSchema)

export type Comment = z.infer<typeof commentSchema>
export type CommentResponse = z.infer<typeof commentResponseSchema>
export type CommentsResponse = z.infer<typeof commentsResponseSchema>
