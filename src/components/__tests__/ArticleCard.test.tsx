import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"

import { ArticleCard } from "@/components/articles/ArticleCard"
import type { Article } from "@/types/api"

function makeArticle(overrides: Partial<Article> = {}): Article {
  return {
    id: 1,
    title: "Como testar React",
    summary: null,
    content: "Conteudo do artigo " + "x".repeat(40),
    categoryId: 1,
    category: "Frontend",
    bannerUrl: null,
    viewsCount: 12,
    likesCount: 3,
    bookmarksCount: 0,
    commentsCount: 2,
    readingTimeMinutes: 3,
    publishedAt: "2026-05-17T10:00:00Z",
    updatedAt: "2026-05-17T10:00:00Z",
    author: {
      id: 9,
      name: "Ana Dev",
      email: "ana@x.com",
      bio: null,
      avatarUrl: null,
      role: "AUTHOR",
    },
    tags: [],
    ...overrides,
  }
}

function renderCard(article: Article, props: { compact?: boolean; highlighted?: boolean } = {}) {
  return render(
    <MemoryRouter>
      <ArticleCard article={article} {...props} />
    </MemoryRouter>,
  )
}

describe("ArticleCard", () => {
  it("renderiza titulo, categoria e autor", () => {
    renderCard(makeArticle())
    expect(screen.getByText("Como testar React")).toBeInTheDocument()
    expect(screen.getByText("Frontend")).toBeInTheDocument()
    expect(screen.getByText("Ana Dev")).toBeInTheDocument()
  })

  it("usa categoria padrao quando ausente", () => {
    renderCard(makeArticle({ category: null }))
    expect(screen.getByText("Desenvolvimento web")).toBeInTheDocument()
  })

  it("usa o id do artigo no link", () => {
    renderCard(makeArticle({ id: 42 }))
    const links = screen.getAllByRole("link")
    expect(links.some((link) => link.getAttribute("href") === "/artigos/42")).toBe(true)
  })

  it("oculta imagem no modo compact", () => {
    renderCard(makeArticle(), { compact: true })
    expect(screen.queryByRole("img")).toBeNull()
  })
})
