/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react"

import {
  bookmarkArticle,
  getArticleBookmarkStatus,
  getArticleLikeStatus,
  likeArticle,
  unbookmarkArticle,
  unlikeArticle,
} from "@/services/articles"

type UseArticleEngagementResult = {
  isLiked: boolean
  isBookmarked: boolean
  likesCount: number | null
  bookmarksCount: number | null
  toggleLike: () => Promise<void>
  toggleBookmark: () => Promise<void>
  error: string
  clearError: () => void
}

export function useArticleEngagement(
  articleId: string | undefined,
  token: string | null,
  isAuthenticated: boolean,
): UseArticleEngagementResult {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState<number | null>(null)
  const [bookmarksCount, setBookmarksCount] = useState<number | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!articleId || !isAuthenticated || !token) {
      setIsLiked(false)
      setIsBookmarked(false)
      setLikesCount(null)
      setBookmarksCount(null)
      return
    }

    let isMounted = true

    Promise.allSettled([
      getArticleLikeStatus(articleId, token),
      getArticleBookmarkStatus(articleId, token),
    ]).then(([likeResult, bookmarkResult]) => {
      if (!isMounted) {
        return
      }

      if (likeResult.status === "fulfilled" && likeResult.value) {
        setIsLiked(Boolean(likeResult.value.liked))
        setLikesCount(likeResult.value.article.likesCount)
      } else {
        setIsLiked(false)
      }

      if (bookmarkResult.status === "fulfilled" && bookmarkResult.value) {
        setIsBookmarked(bookmarkResult.value.bookmarked)
        setBookmarksCount(bookmarkResult.value.article.bookmarksCount)
      } else {
        setIsBookmarked(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [articleId, isAuthenticated, token])

  async function toggleLike() {
    if (!articleId) {
      return
    }

    if (!token) {
      setError("Faca login para curtir artigos.")
      return
    }

    try {
      const response = isLiked ? await unlikeArticle(articleId, token) : await likeArticle(articleId, token)
      if (!response) {
        return
      }
      setIsLiked(Boolean(response.liked))
      setLikesCount(response.article.likesCount)
    } catch {
      setError("Nao foi possivel atualizar a curtida.")
    }
  }

  async function toggleBookmark() {
    if (!articleId) {
      return
    }

    if (!token) {
      setError("Faca login para salvar artigos.")
      return
    }

    try {
      const response = isBookmarked
        ? await unbookmarkArticle(articleId, token)
        : await bookmarkArticle(articleId, token)
      if (!response) {
        return
      }
      setIsBookmarked(response.bookmarked)
      setBookmarksCount(response.article.bookmarksCount)
    } catch {
      setError("Nao foi possivel atualizar o artigo salvo.")
    }
  }

  return {
    isLiked,
    isBookmarked,
    likesCount,
    bookmarksCount,
    toggleLike,
    toggleBookmark,
    error,
    clearError: () => setError(""),
  }
}
