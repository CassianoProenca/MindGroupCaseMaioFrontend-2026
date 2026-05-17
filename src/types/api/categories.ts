import { z } from "zod"

import { paginatedResponse } from "./common"

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  articlesCount: z.number(),
})

export const categoryResponseSchema = z.object({
  category: categorySchema,
})

export const categoriesResponseSchema = paginatedResponse("categories", categorySchema)

export type Category = z.infer<typeof categorySchema>
export type CategoryResponse = z.infer<typeof categoryResponseSchema>
export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>
