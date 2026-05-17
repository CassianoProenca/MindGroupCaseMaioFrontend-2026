import { z } from "zod"

export const paginationMetaSchema = z.object({
  page: z.number(),
  perPage: z.number(),
  total: z.number(),
  totalPages: z.number(),
})

export type PaginationMeta = z.infer<typeof paginationMetaSchema>

export function paginatedResponse<K extends string, T extends z.ZodTypeAny>(
  key: K,
  itemSchema: T,
) {
  return z.object({
    [key]: z.array(itemSchema),
    meta: paginationMetaSchema.optional(),
  }) as z.ZodObject<
    { [P in K]: z.ZodArray<T> } & { meta: z.ZodOptional<typeof paginationMetaSchema> }
  >
}
