import { useEffect, useState } from "react"

type AvatarSize = "md" | "lg"

type AvatarProps = {
  name: string
  url?: string | null
  size?: AvatarSize
  className?: string
}

export function Avatar({ name, url, size = "md", className }: AvatarProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setHasError(false)
  }, [url])

  const initial = (name || "?").charAt(0).toUpperCase()
  const variant = size === "lg" ? " large" : ""
  const extra = className ? ` ${className}` : ""

  if (url && !hasError) {
    return (
      <img
        className={`avatar-image${variant}${extra}`}
        src={url}
        alt={name}
        onError={() => setHasError(true)}
      />
    )
  }

  return <div className={`avatar-placeholder${variant}${extra}`}>{initial}</div>
}
