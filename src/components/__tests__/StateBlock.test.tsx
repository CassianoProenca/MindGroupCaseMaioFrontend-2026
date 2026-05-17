import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { StateBlock } from "@/components/ui/StateBlock"

describe("StateBlock", () => {
  it("renderiza apenas titulo quando nao ha children", () => {
    const { container } = render(<StateBlock title="Vazio" />)
    expect(screen.getByText("Vazio")).toBeInTheDocument()
    expect(container.querySelector("p")).toBeNull()
  })

  it("renderiza titulo e mensagem", () => {
    render(<StateBlock title="Carregando">Aguarde um instante</StateBlock>)
    expect(screen.getByText("Carregando")).toBeInTheDocument()
    expect(screen.getByText("Aguarde um instante")).toBeInTheDocument()
  })
})
