import { userSchema, type User } from "@/types/api"

type DecodedToken = {
  user: User
  expiresAt: number | null
}

function base64UrlDecode(segment: string) {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/")
  const padding = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4))
  const decoded = window.atob(padded + padding)
  try {
    return decodeURIComponent(
      Array.from(decoded)
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join(""),
    )
  } catch {
    return decoded
  }
}

export function decodeToken(token: string): DecodedToken | null {
  const parts = token.split(".")
  if (parts.length !== 3) {
    return null
  }

  let payload: unknown
  try {
    payload = JSON.parse(base64UrlDecode(parts[1]))
  } catch {
    return null
  }

  if (!payload || typeof payload !== "object") {
    return null
  }

  const result = userSchema.safeParse(payload)
  if (!result.success) {
    return null
  }

  const exp = (payload as { exp?: unknown }).exp
  const expiresAt = typeof exp === "number" ? exp * 1000 : null

  return { user: result.data, expiresAt }
}

export function isTokenExpired(token: string) {
  const decoded = decodeToken(token)
  if (!decoded || decoded.expiresAt === null) {
    return false
  }
  return decoded.expiresAt <= Date.now()
}
