/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react"

import { getApiErrorMessage } from "@/services/api"
import { createComment, listComments } from "@/services/articles"
import type { Comment, PaginationMeta } from "@/types/api"

const COMMENTS_PER_PAGE = 5

const emptyMeta: PaginationMeta = {
  page: 1,
  perPage: COMMENTS_PER_PAGE,
  total: 0,
  totalPages: 1,
}

type UseArticleCommentsResult = {
  comments: Comment[]
  meta: PaginationMeta
  search: string
  setSearch: (search: string) => void
  isLoading: boolean
  loadMore: () => Promise<void>
  submit: (content: string, token: string) => Promise<void>
  isSubmitting: boolean
  error: string
}

export function useArticleComments(articleId: string | undefined): UseArticleCommentsResult {
  const [comments, setComments] = useState<Comment[]>([])
  const [meta, setMeta] = useState<PaginationMeta>(emptyMeta)
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!articleId) {
      return
    }

    let isMounted = true
    setIsLoading(true)

    listComments(articleId, {
      page: 1,
      perPage: COMMENTS_PER_PAGE,
      search: search.trim() || undefined,
    })
      .then((response) => {
        if (!isMounted || !response) {
          return
        }
        setComments(response.comments)
        setMeta(response.meta ?? emptyMeta)
      })
      .catch(() => {
        if (isMounted) {
          setComments([])
          setMeta(emptyMeta)
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
  }, [articleId, search])

  async function loadMore() {
    if (!articleId || meta.page >= meta.totalPages) {
      return
    }

    setIsLoading(true)

    try {
      const nextPage = meta.page + 1
      const response = await listComments(articleId, {
        page: nextPage,
        perPage: COMMENTS_PER_PAGE,
        search: search.trim() || undefined,
      })
      if (!response) {
        return
      }
      setComments((current) => [...current, ...response.comments])
      setMeta(response.meta ?? meta)
    } finally {
      setIsLoading(false)
    }
  }

  async function submit(content: string, token: string) {
    if (!articleId) {
      return
    }

    setError("")
    setIsSubmitting(true)

    try {
      const response = await createComment(articleId, { content }, token)
      if (!response) {
        return
      }
      setComments((current) => [response.comment, ...current])
      setMeta((current) => ({ ...current, total: current.total + 1 }))
    } catch (caught) {
      setError(getApiErrorMessage(caught))
      throw caught
    } finally {
      setIsSubmitting(false)
    }
  }

  return { comments, meta, search, setSearch, isLoading, loadMore, submit, isSubmitting, error }
}
