import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Pagination } from "@/components/ui/Pagination"

describe("Pagination", () => {
  it("nao renderiza quando totalPages <= 1", () => {
    const { container } = render(<Pagination page={1} totalPages={1} onChange={() => {}} />)
    expect(container.firstChild).toBeNull()
  })

  it("exibe pagina atual e total", () => {
    render(<Pagination page={2} totalPages={5} onChange={() => {}} />)
    expect(screen.getByText("Pagina 2 de 5")).toBeInTheDocument()
  })

  it("desabilita Anterior na primeira pagina", () => {
    render(<Pagination page={1} totalPages={3} onChange={() => {}} />)
    expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Proxima" })).not.toBeDisabled()
  })

  it("desabilita Proxima na ultima pagina", () => {
    render(<Pagination page={3} totalPages={3} onChange={() => {}} />)
    expect(screen.getByRole("button", { name: "Anterior" })).not.toBeDisabled()
    expect(screen.getByRole("button", { name: "Proxima" })).toBeDisabled()
  })

  it("chama onChange com page-1 ao clicar Anterior", () => {
    const handler = vi.fn()
    render(<Pagination page={3} totalPages={5} onChange={handler} />)
    fireEvent.click(screen.getByRole("button", { name: "Anterior" }))
    expect(handler).toHaveBeenCalledWith(2)
  })

  it("chama onChange com page+1 ao clicar Proxima", () => {
    const handler = vi.fn()
    render(<Pagination page={3} totalPages={5} onChange={handler} />)
    fireEvent.click(screen.getByRole("button", { name: "Proxima" }))
    expect(handler).toHaveBeenCalledWith(4)
  })

  it("compoe className extra sem perder pagination-row", () => {
    render(<Pagination page={1} totalPages={2} onChange={() => {}} className="extra" />)
    const button = screen.getByRole("button", { name: "Anterior" })
    expect(button.parentElement?.className).toBe("pagination-row extra")
  })
})
