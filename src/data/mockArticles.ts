import type { Article } from "@/types/api"

const now = new Date("2026-01-20T12:00:00.000Z").toISOString()

export const mockArticles: Article[] = Array.from({ length: 10 }).map((_, index) => ({
  id: index + 1,
  title:
    index % 2 === 0
      ? "O Futuro da Inteligencia Artificial em 2025"
      : "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  content:
    "A inteligencia artificial continua a evoluir em um ritmo acelerado. Neste artigo, vamos explorar as principais tendencias e inovacoes que estao moldando o futuro da IA.\n\n## Modelos de Linguagem Avancados\n\nOs modelos de linguagem como GPT-4 e alem estao se tornando cada vez mais sofisticados, capazes de entender e gerar texto com precisao impressionante.\n\n## Automacao Inteligente\n\nA automacao esta alcancando novos patamares com sistemas de IA que podem tomar decisoes complexas e adaptar-se a novas situacoes.\n\n## Etica e Responsabilidade\n\nCom o avanco da IA, questoes eticas se tornam cada vez mais importantes. E crucial desenvolver sistemas responsaveis e transparentes.",
  bannerUrl: null,
  publishedAt: now,
  updatedAt: now,
  author: {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  },
}))
