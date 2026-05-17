import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { ProtectedRoute } from "@/components/layout/ProtectedRoute"

const mockUseAuth = vi.fn()

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
}))

describe("ProtectedRoute", () => {
  beforeEach(() => {
    mockUseAuth.mockReset()
  })

  it("mostra estado de carregamento enquanto sessao e validada", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: true })
    render(
      <MemoryRouter initialEntries={["/secret"]}>
        <Routes>
          <Route
            path="/secret"
            element={
              <ProtectedRoute>
                <div>conteudo protegido</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText("Carregando sessao")).toBeInTheDocument()
  })

  it("redireciona para /login quando nao autenticado", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, isLoading: false })
    render(
      <MemoryRouter initialEntries={["/secret"]}>
        <Routes>
          <Route
            path="/secret"
            element={
              <ProtectedRoute>
                <div>conteudo protegido</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>pagina de login</div>} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText("pagina de login")).toBeInTheDocument()
    expect(screen.queryByText("conteudo protegido")).toBeNull()
  })

  it("renderiza filhos quando autenticado", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, isLoading: false })
    render(
      <MemoryRouter initialEntries={["/secret"]}>
        <Routes>
          <Route
            path="/secret"
            element={
              <ProtectedRoute>
                <div>conteudo protegido</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByText("conteudo protegido")).toBeInTheDocument()
  })
})
