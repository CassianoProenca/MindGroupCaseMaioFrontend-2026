import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Avatar } from "@/components/ui/Avatar"

describe("Avatar", () => {
  it("renderiza placeholder com a inicial em maiusculo quando nao ha url", () => {
    render(<Avatar name="ana" />)
    expect(screen.getByText("A")).toBeInTheDocument()
  })

  it("usa '?' quando nome esta vazio", () => {
    render(<Avatar name="" />)
    expect(screen.getByText("?")).toBeInTheDocument()
  })

  it("renderiza imagem quando ha url", () => {
    render(<Avatar name="Ana" url="https://x/img.png" />)
    const image = screen.getByRole("img", { name: "Ana" })
    expect(image).toHaveAttribute("src", "https://x/img.png")
  })

  it("recai para placeholder quando imagem falha", () => {
    render(<Avatar name="Ana" url="https://x/quebrado.png" />)
    const image = screen.getByRole("img", { name: "Ana" })
    fireEvent.error(image)
    expect(screen.getByText("A")).toBeInTheDocument()
  })

  it("aplica classe 'large' quando size=lg", () => {
    render(<Avatar name="Ana" size="lg" />)
    expect(screen.getByText("A").className).toContain("large")
  })
})
