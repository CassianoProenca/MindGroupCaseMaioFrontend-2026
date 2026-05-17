import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { TextArea, TextInput } from "@/components/ui/FormField"

describe("TextInput", () => {
  it("renderiza label e propaga atributos para o input", () => {
    render(<TextInput label="Email" placeholder="seu@email" type="email" />)
    expect(screen.getByText("Email")).toBeInTheDocument()
    const input = screen.getByPlaceholderText("seu@email") as HTMLInputElement
    expect(input.type).toBe("email")
  })

  it("dispara onChange ao digitar", async () => {
    const handleChange = vi.fn()
    render(<TextInput label="Nome" onChange={handleChange} placeholder="Nome" />)
    await userEvent.type(screen.getByPlaceholderText("Nome"), "Ana")
    expect(handleChange).toHaveBeenCalled()
  })

  it("renderiza hint quando informada", () => {
    render(<TextInput label="Senha" hint="Use ao menos 6 caracteres" />)
    expect(screen.getByText("Use ao menos 6 caracteres")).toBeInTheDocument()
  })

  it("renderiza action no cabecalho do campo", () => {
    render(<TextInput label="Senha" action={<button type="button">Esqueci</button>} />)
    expect(screen.getByText("Esqueci")).toBeInTheDocument()
  })
})

describe("TextArea", () => {
  it("renderiza textarea com valor inicial", () => {
    render(<TextArea label="Bio" defaultValue="ola" />)
    expect(screen.getByText("Bio")).toBeInTheDocument()
    expect(screen.getByDisplayValue("ola")).toBeInTheDocument()
  })
})
