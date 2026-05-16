import { useEffect, useState } from "react"

import { listArticles } from "@/services/articles"
import type { Article, PaginationMeta } from "@/types/api"

type UseArticlesParams = {
  categoryId?: string
  page?: number
  perPage?: number
  search?: string
}

function emptyMeta(perPage: number): PaginationMeta {
  return { page: 1, perPage, total: 0, totalPages: 1 }
}

export function useArticles(params: UseArticlesParams = {}) {
  const perPage = params.perPage ?? 10
  const [articles, setArticles] = useState<Article[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(() => emptyMeta(perPage))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    listArticles(params)
      .then(({ articles, meta }) => {
        if (isMounted) {
          setArticles(articles)
          setMeta(meta ?? emptyMeta(perPage))
        }
      })
      .catch(() => {
        if (isMounted) {
          setArticles([])
          setMeta(emptyMeta(perPage))
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [params.categoryId, params.page, params.perPage, params.search])

  return { articles, meta, isLoading }
}
