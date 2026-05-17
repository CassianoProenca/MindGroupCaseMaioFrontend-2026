import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Badge } from "@/components/ui/Badge"

describe("Badge", () => {
  it("renderiza conteudo filho", () => {
    render(<Badge>Frontend</Badge>)
    expect(screen.getByText("Frontend")).toBeInTheDocument()
  })

  it("aplica classe padrao 'muted'", () => {
    render(<Badge>x</Badge>)
    expect(screen.getByText("x").className).toContain("ui-badge--muted")
  })

  it("aplica tom alternativo", () => {
    render(<Badge tone="warning">x</Badge>)
    expect(screen.getByText("x").className).toContain("ui-badge--warning")
  })

  it("mescla classe externa", () => {
    render(<Badge className="extra">x</Badge>)
    expect(screen.getByText("x").className).toContain("extra")
  })
})
