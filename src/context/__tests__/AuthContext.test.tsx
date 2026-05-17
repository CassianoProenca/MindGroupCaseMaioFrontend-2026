import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { AuthProvider, useAuth } from "@/context/AuthContext"

vi.mock("@/services/auth", () => ({
  getMe: vi.fn(),
  login: vi.fn(),
  register: vi.fn(),
  resetPassword: vi.fn(),
}))

import * as authService from "@/services/auth"

const fakeUser = {
  id: 1,
  name: "Ana",
  email: "ana@example.com",
  bio: null,
  avatarUrl: null,
  role: "AUTHOR",
}

function base64UrlEncode(input: string) {
  return btoa(input).replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function makeToken(payload: Record<string, unknown>) {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }))
  const body = base64UrlEncode(JSON.stringify(payload))
  return `${header}.${body}.assinatura-fake`
}

const fakeToken = makeToken({ ...fakeUser, exp: Math.floor(Date.now() / 1000) + 3600 })

function Consumer() {
  const auth = useAuth()
  const [error, setError] = useState<string | null>(null)

  async function attemptLogin() {
    try {
      await auth.login({ email: "ana@example.com", password: "secret1" })
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div>
      <span data-testid="status">
        {auth.isLoading ? "loading" : auth.isAuthenticated ? "in" : "out"}
      </span>
      <span data-testid="name">{auth.user?.name ?? "anon"}</span>
      <span data-testid="error">{error ?? ""}</span>
      <button type="button" onClick={attemptLogin}>
        login
      </button>
      <button type="button" onClick={auth.logout}>
        logout
      </button>
    </div>
  )
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>,
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  window.localStorage.clear()
  vi.mocked(authService.getMe).mockResolvedValue({ user: fakeUser })
})

describe("AuthContext", () => {
  it("usuario sai como anonimo quando nao ha token", () => {
    renderWithProvider()
    expect(screen.getByTestId("status").textContent).toBe("out")
    expect(screen.getByTestId("name").textContent).toBe("anon")
  })

  it("persistencia: faz login e salva apenas o token no localStorage", async () => {
    vi.mocked(authService.login).mockResolvedValue({ user: fakeUser, token: fakeToken })

    renderWithProvider()
    await userEvent.click(screen.getByText("login"))

    await waitFor(() => {
      expect(screen.getByTestId("status").textContent).toBe("in")
    })
    expect(screen.getByTestId("name").textContent).toBe("Ana")
    expect(window.localStorage.getItem("mind_blog_token")).toBe(fakeToken)
    expect(window.localStorage.getItem("mind_blog_user")).toBeNull()
  })

  it("logout limpa estado e storage", async () => {
    vi.mocked(authService.login).mockResolvedValue({ user: fakeUser, token: fakeToken })
    renderWithProvider()
    await userEvent.click(screen.getByText("login"))
    await waitFor(() => expect(screen.getByTestId("status").textContent).toBe("in"))

    await userEvent.click(screen.getByText("logout"))
    expect(screen.getByTestId("status").textContent).toBe("out")
    expect(window.localStorage.getItem("mind_blog_token")).toBeNull()
  })

  it("ao montar com token salvo, decodifica o user e revalida via getMe", async () => {
    window.localStorage.setItem("mind_blog_token", fakeToken)
    vi.mocked(authService.getMe).mockResolvedValue({ user: fakeUser })

    renderWithProvider()

    expect(screen.getByTestId("name").textContent).toBe("Ana")
    await waitFor(() => expect(screen.getByTestId("status").textContent).toBe("in"))
    expect(authService.getMe).toHaveBeenCalledWith(fakeToken)
  })

  it("remove entrada legada mind_blog_user do localStorage ao montar", () => {
    window.localStorage.setItem("mind_blog_user", JSON.stringify(fakeUser))
    renderWithProvider()
    expect(window.localStorage.getItem("mind_blog_user")).toBeNull()
  })

  it("limpa sessao quando getMe falha", async () => {
    window.localStorage.setItem("mind_blog_token", fakeToken)
    vi.mocked(authService.getMe).mockRejectedValue(new Error("expired"))

    renderWithProvider()

    await waitFor(() => expect(screen.getByTestId("status").textContent).toBe("out"))
    expect(window.localStorage.getItem("mind_blog_token")).toBeNull()
  })

  it("useAuth lanca quando fora do provider", () => {
    expect(() => render(<Consumer />)).toThrow(/AuthProvider/)
  })

  it("nao autentica quando servico de login falha", async () => {
    vi.mocked(authService.login).mockRejectedValue(new Error("credenciais invalidas"))
    renderWithProvider()
    await act(async () => {
      await userEvent.click(screen.getByText("login"))
    })
    expect(screen.getByTestId("status").textContent).toBe("out")
    expect(screen.getByTestId("error").textContent).toBe("credenciais invalidas")
  })
})
