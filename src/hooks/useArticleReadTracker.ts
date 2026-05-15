import { useEffect, useRef } from "react"

import { apiUrl } from "@/services/api"

const READER_ID_KEY = "mind_blog_reader_id"
const VIEWED_ARTICLES_KEY = "mind_blog_viewed_articles"
const MIN_READ_SECONDS = 10

export function getReaderId() {
  const storedReaderId = window.localStorage.getItem(READER_ID_KEY)

  if (storedReaderId) {
    return storedReaderId
  }

  const nextReaderId = window.crypto?.randomUUID ? window.crypto.randomUUID() : `reader_${Date.now()}_${Math.random()}`
  window.localStorage.setItem(READER_ID_KEY, nextReaderId)
  return nextReaderId
}

export function hasViewedArticle(articleId: number): boolean {
  const viewed = window.localStorage.getItem(VIEWED_ARTICLES_KEY)
  if (!viewed) return false
  const viewedIds = JSON.parse(viewed)
  return Array.isArray(viewedIds) && viewedIds.includes(articleId)
}

export function markArticleAsViewed(articleId: number): void {
  const viewed = window.localStorage.getItem(VIEWED_ARTICLES_KEY)
  const viewedIds = viewed ? JSON.parse(viewed) : []
  if (!viewedIds.includes(articleId)) {
    viewedIds.push(articleId)
    window.localStorage.setItem(VIEWED_ARTICLES_KEY, JSON.stringify(viewedIds))
  }
}

export function useArticleReadTracker(articleId: number | null, token: string | null) {
  const activeStartedAtRef = useRef<number | null>(null)
  const activeMsRef = useRef(0)
  const sentSecondsRef = useRef(0)

  useEffect(() => {
    if (!articleId) {
      return
    }

    const trackedArticleId = articleId
    activeMsRef.current = 0
    sentSecondsRef.current = 0
    activeStartedAtRef.current = document.visibilityState === "visible" ? Date.now() : null

    function pauseTimer() {
      if (activeStartedAtRef.current) {
        activeMsRef.current += Date.now() - activeStartedAtRef.current
        activeStartedAtRef.current = null
      }
    }

    function resumeTimer() {
      if (!activeStartedAtRef.current && document.visibilityState === "visible") {
        activeStartedAtRef.current = Date.now()
      }
    }

    function getDurationSeconds() {
      const liveMs = activeStartedAtRef.current ? Date.now() - activeStartedAtRef.current : 0
      return Math.floor((activeMsRef.current + liveMs) / 1000)
    }

    function sendRead(options: { final?: boolean } = {}) {
      if (options.final) {
        pauseTimer()
      }

      const durationSeconds = getDurationSeconds()
      const unsentSeconds = durationSeconds - sentSecondsRef.current

      if (unsentSeconds < MIN_READ_SECONDS) {
        return
      }

      sentSecondsRef.current = durationSeconds
      const payload = {
        durationSeconds: unsentSeconds,
        readerId: getReaderId(),
      }

      const body = JSON.stringify(payload)
      const url = `${apiUrl}/articles/${trackedArticleId}/read`

      if (token) {
        void fetch(url, {
          body,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          keepalive: true,
          method: "POST",
        })
        return
      }

      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, new Blob([body], { type: "application/json" }))
        return
      }

      void fetch(url, {
        body,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        method: "POST",
      })
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        pauseTimer()
      } else {
        resumeTimer()
      }
    }

    function handlePageHide() {
      sendRead({ final: true })
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("pagehide", handlePageHide)
    const interval = window.setInterval(() => sendRead(), 2000)

    return () => {
      sendRead({ final: true })
      window.clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("pagehide", handlePageHide)
    }
  }, [articleId, token])
}
