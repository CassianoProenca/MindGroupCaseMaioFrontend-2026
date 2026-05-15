import { useEffect, useState } from "react"

import { mockArticles } from "@/data/mockArticles"
import { listArticles } from "@/services/articles"
import type { Article, PaginationMeta } from "@/types/api"

type UseArticlesParams = {
  categoryId?: string
  page?: number
  perPage?: number
  search?: string
}

const fallbackMeta: PaginationMeta = {
  page: 1,
  perPage: mockArticles.length,
  total: mockArticles.length,
  totalPages: 1,
}

export function useArticles(params: UseArticlesParams = {}) {
  const [articles, setArticles] = useState<Article[]>(mockArticles)
  const [meta, setMeta] = useState<PaginationMeta>(fallbackMeta)
  const [isLoading, setIsLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    listArticles(params)
      .then(({ articles, meta }) => {
        if (isMounted) {
          setArticles(articles)
          setMeta(meta ?? fallbackMeta)
          setIsFallback(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setArticles(mockArticles)
          setMeta(fallbackMeta)
          setIsFallback(true)
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

  return { articles, meta, isLoading, isFallback }
}
