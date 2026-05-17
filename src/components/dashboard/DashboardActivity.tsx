import type { UIEvent } from "react"

import { Avatar } from "@/components/ui/Avatar"
import { StateBlock } from "@/components/ui/StateBlock"
import { formatRelativeTime } from "@/lib/format"
import type { RecentActivity } from "@/types/api"

type DashboardActivityProps = {
  items: RecentActivity[]
  total: number
  isLoading: boolean
  onScroll: (event: UIEvent<HTMLDivElement>) => void
}

export function DashboardActivity({ items, total, isLoading, onScroll }: DashboardActivityProps) {
  const reachedEnd = !isLoading && items.length > 0 && items.length >= total

  return (
    <aside className="surface-panel recent-activity">
      <h2>Atividade Recente</h2>
      <div className="recent-activity-body" onScroll={onScroll}>
        {isLoading && items.length === 0 ? <StateBlock title="Carregando atividade" /> : null}
        {!isLoading && items.length === 0 ? <StateBlock title="Nenhuma atividade ainda" /> : null}
        {items.map((item) => (
          <article key={item.id}>
            <Avatar name={item.author.name} url={item.author.avatarUrl} />
            <p>
              <strong>{item.author.name}</strong> comentou em <strong>{item.article.title}</strong>
              <span>{formatRelativeTime(item.createdAt)}</span>
            </p>
          </article>
        ))}
        {isLoading && items.length > 0 ? <div className="recent-activity-loading">Carregando...</div> : null}
        {reachedEnd ? <div className="recent-activity-loading">Sem mais atividades.</div> : null}
      </div>
    </aside>
  )
}
