import { z } from "zod"

export const apiErrorResponseSchema = z.object({
  message: z.string().optional(),
})

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>
