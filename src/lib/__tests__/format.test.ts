import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  formatDate,
  formatDateNumeric,
  formatDuration,
  formatRelativeTime,
  getArticleImage,
  getArticleImageFallback,
  getExcerpt,
  getReadingTime,
} from "@/lib/format"

describe("formatDate", () => {
  it("formata para dia abreviado em portugues", () => {
    expect(formatDate("2026-05-17T12:00:00Z")).toMatch(/\d{1,2} (jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez) 2026/)
  })
})

describe("formatDateNumeric", () => {
  it("formata para dd/mm/yyyy", () => {
    expect(formatDateNumeric("2026-05-17T12:00:00Z")).toMatch(/^\d{2}\/\d{2}\/2026$/)
  })
})

describe("formatRelativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-05-17T12:00:00Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("retorna minutos para datas recentes", () => {
    const date = new Date("2026-05-17T11:55:00Z").toISOString()
    expect(formatRelativeTime(date)).toContain("min")
  })

  it("retorna dias para datas mais antigas", () => {
    const date = new Date("2026-05-10T12:00:00Z").toISOString()
    expect(formatRelativeTime(date)).toMatch(/dia|sem/)
  })
})

describe("getReadingTime", () => {
  it("retorna pelo menos 1 minuto para conteudo vazio", () => {
    expect(getReadingTime("")).toBe(1)
  })

  it("aumenta conforme numero de palavras", () => {
    const small = Array.from({ length: 50 }, () => "p").join(" ")
    const big = Array.from({ length: 1000 }, () => "p").join(" ")
    expect(getReadingTime(big)).toBeGreaterThan(getReadingTime(small))
  })
})

describe("formatDuration", () => {
  it("retorna 0s quando duracao <= 0", () => {
    expect(formatDuration(0)).toBe("0s")
    expect(formatDuration(-1)).toBe("0s")
  })

  it("usa apenas segundos quando abaixo de 1 minuto", () => {
    expect(formatDuration(45)).toBe("45s")
  })

  it("usa minutos sem segundos quando exato", () => {
    expect(formatDuration(120)).toBe("2min")
  })

  it("combina minutos e segundos", () => {
    expect(formatDuration(125)).toBe("2min 5s")
  })
})

describe("getExcerpt", () => {
  it("retorna texto inalterado quando curto", () => {
    expect(getExcerpt("conteudo curto")).toBe("conteudo curto")
  })

  it("trunca e adiciona reticencias quando longo", () => {
    const long = "x".repeat(200)
    const result = getExcerpt(long, 50)
    expect(result.endsWith("...")).toBe(true)
    expect(result.length).toBeLessThanOrEqual(53)
  })

  it("remove marcacoes de cabecalho e quebras", () => {
    expect(getExcerpt("# Titulo\n\nparagrafo")).toBe("Titulo paragrafo")
  })
})

describe("getArticleImage", () => {
  it("usa placeholder quando bannerUrl e null", () => {
    expect(getArticleImage(42, null)).toContain("placeholder-article.svg")
  })

  it("retorna URL absoluta inalterada", () => {
    expect(getArticleImage(1, "https://cdn.example.com/x.png")).toBe("https://cdn.example.com/x.png")
  })

  it("preserva data: e blob:", () => {
    expect(getArticleImage(1, "data:image/png;base64,abc")).toBe("data:image/png;base64,abc")
    expect(getArticleImage(1, "blob:http://x/y")).toBe("blob:http://x/y")
  })

  it("monta URL absoluta a partir do path relativo", () => {
    expect(getArticleImage(1, "/articles/1/banner")).toContain("/articles/1/banner")
  })
})

describe("getArticleImageFallback", () => {
  it("inclui o id no path", () => {
    expect(getArticleImageFallback(7)).toContain("id=7")
  })
})
