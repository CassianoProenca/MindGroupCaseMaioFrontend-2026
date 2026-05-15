import { useEffect, useState } from "react"

import { mockArticles } from "@/data/mockArticles"
import { listArticles } from "@/services/articles"
import type { Article } from "@/types/api"

export function useArticles() {
  const [articles, setArticles] = useState<Article[]>(mockArticles)
  const [isLoading, setIsLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    let isMounted = true

    listArticles()
      .then(({ articles }) => {
        if (isMounted) {
          setArticles(articles.length > 0 ? articles : mockArticles)
          setIsFallback(articles.length === 0)
        }
      })
      .catch(() => {
        if (isMounted) {
          setArticles(mockArticles)
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
  }, [])

  return { articles, isLoading, isFallback }
}
