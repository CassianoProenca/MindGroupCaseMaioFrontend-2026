import type { ReactNode } from "react"

type StateBlockProps = {
  title: string
  children?: ReactNode
}

export function StateBlock({ title, children }: StateBlockProps) {
  return (
    <div className="state-block">
      <strong>{title}</strong>
      {children ? <p>{children}</p> : null}
    </div>
  )
}
