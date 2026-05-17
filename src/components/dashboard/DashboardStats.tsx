import { FileText, Heart, MessageSquare, TrendingUp } from "lucide-react"

import { StateBlock } from "@/components/ui/StateBlock"
import type { DashboardMetricsResponse } from "@/types/api"

export type DashboardTotals = DashboardMetricsResponse["metrics"]["totals"]

type DashboardStatsProps = {
  totals: DashboardTotals | null
  isLoading: boolean
  errorMessage?: string
}

export function DashboardStats({ totals, isLoading, errorMessage }: DashboardStatsProps) {
  const stats = [
    { label: "Total de Artigos", value: totals?.articles ?? 0, icon: FileText },
    { label: "Engajamento", value: totals?.engagement ?? 0, icon: MessageSquare },
    { label: "Curtidas", value: totals?.likes ?? 0, icon: Heart },
    {
      label: "Tempo medio de leitura",
      value: `${totals?.averageReadingTimeMinutes ?? 0} min`,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="stats-grid">
      {isLoading ? <StateBlock title="Carregando metricas" /> : null}
      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
      {!isLoading
        ? stats.map((item) => {
            const Icon = item.icon
            return (
              <article className="stat-card" key={item.label}>
                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
                <Icon size={24} />
              </article>
            )
          })
        : null}
    </div>
  )
}
