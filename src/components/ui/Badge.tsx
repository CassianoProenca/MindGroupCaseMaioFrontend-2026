import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type BadgeProps = {
  children: ReactNode
  tone?: "muted" | "accent" | "warning"
  className?: string
}

export function Badge({ children, tone = "muted", className }: BadgeProps) {
  return <span className={cn("ui-badge", `ui-badge--${tone}`, className)}>{children}</span>
}
