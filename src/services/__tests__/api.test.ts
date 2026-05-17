import { AxiosError, AxiosHeaders } from "axios"
import { describe, expect, it } from "vitest"
import { z } from "zod"

import {
  ApiError,
  authConfig,
  authConfigWithFile,
  getApiErrorMessage,
  getBannerUrl,
  normalizeAxiosError,
  parseApiResponse,
} from "@/services/api"

describe("parseApiResponse", () => {
  it("retorna dados quando esquema valida", () => {
    const schema = z.object({ name: z.string() })
    expect(parseApiResponse(schema, { name: "Ana" })).toEqual({ name: "Ana" })
  })

  it("lanca ApiError quando formato e inesperado", () => {
    const schema = z.object({ name: z.string() })
    try {
      parseApiResponse(schema, { name: 42 })
      throw new Error("nao deveria chegar aqui")
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError)
      expect((error as ApiError).status).toBe(500)
    }
  })
})

describe("getApiErrorMessage", () => {
  it("usa a mensagem do ApiError", () => {
    expect(getApiErrorMessage(new ApiError("ops", 500))).toBe("ops")
  })

  it("extrai mensagem do AxiosError", () => {
    const error = new AxiosError(
      "request failed",
      "ERR",
      undefined,
      undefined,
      {
        status: 400,
        statusText: "Bad Request",
        headers: {},
        data: { message: "Email invalido" },
        config: { headers: new AxiosHeaders() },
      },
    )
    expect(getApiErrorMessage(error)).toBe("Email invalido")
  })

  it("mensagem padrao quando dados do AxiosError nao seguem o schema", () => {
    const error = new AxiosError("oops", "ERR", undefined, undefined, {
      status: 500,
      statusText: "",
      headers: {},
      data: { foo: "bar" },
      config: { headers: new AxiosHeaders() },
    })
    expect(getApiErrorMessage(error)).toBe("Nao foi possivel concluir a acao.")
  })

  it("extrai primeira issue do ZodError", () => {
    try {
      z.object({ name: z.string() }).parse({ name: 1 })
    } catch (error) {
      expect(getApiErrorMessage(error)).toMatch(/.+/)
    }
  })

  it("usa Error.message como fallback", () => {
    expect(getApiErrorMessage(new Error("boom"))).toBe("boom")
  })

  it("mensagem padrao para tipos desconhecidos", () => {
    expect(getApiErrorMessage(null)).toBe("Nao foi possivel concluir a acao.")
  })
})

describe("normalizeAxiosError", () => {
  it("preserva ApiError", () => {
    const original = new ApiError("ops", 418)
    try {
      normalizeAxiosError(original)
    } catch (error) {
      expect(error).toBe(original)
    }
  })

  it("transforma AxiosError em ApiError com status", () => {
    const error = new AxiosError("x", "ERR", undefined, undefined, {
      status: 401,
      statusText: "",
      headers: {},
      data: { message: "Token expirado." },
      config: { headers: new AxiosHeaders() },
    })

    try {
      normalizeAxiosError(error)
    } catch (caught) {
      expect(caught).toBeInstanceOf(ApiError)
      expect((caught as ApiError).status).toBe(401)
      expect((caught as ApiError).message).toBe("Token expirado.")
    }
  })

  it("transforma ZodError em ApiError 400", () => {
    try {
      z.object({ name: z.string() }).parse({})
    } catch (error) {
      try {
        normalizeAxiosError(error)
      } catch (caught) {
        expect(caught).toBeInstanceOf(ApiError)
        expect((caught as ApiError).status).toBe(400)
      }
    }
  })
})

describe("authConfig / authConfigWithFile", () => {
  it("monta header com Bearer token e JSON", () => {
    expect(authConfig("abc").headers).toEqual({
      Authorization: "Bearer abc",
      "Content-Type": "application/json",
    })
  })

  it("authConfigWithFile nao define Content-Type", () => {
    const headers = authConfigWithFile("abc").headers as Record<string, string>
    expect(headers.Authorization).toBe("Bearer abc")
    expect(headers["Content-Type"]).toBeUndefined()
  })
})

describe("getBannerUrl", () => {
  it("retorna null quando path e null", () => {
    expect(getBannerUrl(null)).toBeNull()
  })

  it("prefixa com a base da API", () => {
    expect(getBannerUrl("/articles/1/banner")).toMatch(/\/articles\/1\/banner$/)
  })
})
