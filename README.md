# Mind Blog Frontend

Frontend em React, TypeScript e Vite para o case de estagio da Mind Group.

> Backend do projeto: https://github.com/CassianoProenca/MindGroupCaseMaioBackend-2026

## Tecnologias

- React 19
- TypeScript
- Vite 8
- Tailwind CSS v4 (via `@tailwindcss/vite`, sem `tailwind.config`)
- shadcn/ui + Radix UI
- React Router v7
- Axios
- Zod (validacao das respostas da API)
- lucide-react (icones)
- Vitest + @testing-library/react + jsdom para testes

## Sumario

- [Requisitos](#requisitos)
- [Quick start](#quick-start)
- [Login pos-seed do backend](#login-pos-seed-do-backend)
- [Scripts npm](#scripts-npm)
- [Testes](#testes)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Rotas](#rotas)
- [Integracao com backend](#integracao-com-backend)
- [Persistencia de sessao](#persistencia-de-sessao)
- [Features de UX](#features-de-ux)
- [Cobertura dos requisitos do case](#cobertura-dos-requisitos-do-case)

## Requisitos

- Node.js 24 e npm
- Backend Mind Blog API rodando (veja o repositorio do backend)

## Quick start

Ordem recomendada:

1. **Suba o backend primeiro** (veja o README do repositorio do backend).
2. Copie o `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
   A URL da API ja vem com `VITE_API_URL=http://localhost:3333`. Ajuste se o backend rodar em outra origem.
3. Instale dependencias e suba o dev server:
   ```bash
   npm install
   npm run dev
   ```

A aplicacao sobe em `http://localhost:5173`.

> **Importante:** se o backend nao estiver rodando, as paginas que dependem de dados (listagem, dashboard) vao renderizar empty states ate ele ficar disponivel.

### Login pos-seed do backend

| Campo | Valor |
|---|---|
| Email | `john@example.com` |
| Senha | `123456` |

## Scripts npm

```bash
npm run dev            # vite dev server
npm run build          # tsc -b && vite build (type check faz parte do build)
npm run preview        # serve o build pra inspecao local
npm run lint           # eslint .
npm test               # roda toda a suite Vitest
npm run test:watch     # modo watch
npm run test:coverage  # relatorio de cobertura
```

## Testes

A suite usa **Vitest** + **@testing-library/react** + **jsdom**. Cobertura atual:

- `src/context/__tests__/AuthContext.test.tsx` — login, logout, hidratacao do user a partir do token e revalidacao em background via `/auth/me`.
- `src/components/__tests__/ProtectedRoute.test.tsx` — redirecionamento de rotas protegidas e preservacao da origem em `state.from`.
- `src/components/__tests__/` — primitivos: `ArticleCard`, `Avatar`, `Badge`, `FormField`, `Pagination`, `StateBlock`.
- `src/services/__tests__/api.test.ts` — `parseApiResponse` (validacao Zod no boundary) e `normalizeAxiosError`.

```bash
npm test                 # roda tudo uma vez
npm run test:watch       # re-roda ao salvar
npm run test:coverage    # gera relatorio em coverage/
```

## Estrutura do projeto

```
src/
  App.tsx                 # rotas + AppShell + ProtectedRoute
  main.tsx                # bootstrap React
  index.css               # estilos globais (Tailwind v4)
  pages/                  # uma por rota
  components/
    articles/             # cards, listagem, form de upsert, modal de share
    auth/                 # AuthCard, UserMenu
    layout/               # AppShell, ProtectedRoute, Header
    ui/                   # primitivos shadcn (Button, FormField, Avatar, Badge)
  context/
    AuthContext.tsx       # estado de auth + persistencia em localStorage
  services/               # camada HTTP (axios + Zod no boundary)
    api.ts                # instancia axios, parseApiResponse, normalizeAxiosError, getBannerUrl
    auth.ts, articles.ts, profile.ts, ...
  types/api/              # schemas Zod + tipos inferidos por dominio
  hooks/                  # useArticles, useArticleComments, useArticleEngagement, useArticleReadTracker
  lib/                    # helpers de formatacao
  test/                   # setup do Vitest
```

Alias `@/*` -> `src/*` configurado em `vite.config.ts` e `tsconfig.json`.

## Rotas

| Caminho | Pagina | Auth |
|---|---|---|
| `/` | Home com destaque | publica |
| `/artigos` | Listagem com busca/filtros | publica |
| `/artigos/:id` | Detalhe do artigo | publica |
| `/login` | Login | publica |
| `/cadastro` | Cadastro | publica |
| `/esqueci-minha-senha` | Solicita email de reset | publica |
| `/resetar-senha/:token` | Define nova senha (auto-login no sucesso) | publica |
| `/dashboard` | Metricas dos artigos do usuario | protegida |
| `/categorias` | Gestao de categorias | protegida |
| `/artigos/novo` | Criacao de artigo | protegida |
| `/artigos/:id/editar` | Edicao de artigo | protegida |
| `/configuracoes` | Perfil + tema | protegida |

Rotas protegidas usam `<ProtectedRoute>`. Sem token, redirecionam para `/login` mantendo a origem em `state.from`.

## Integracao com backend

Toda chamada passa por uma instancia compartilhada do `axios` (`services/api.ts`) configurada pelo `VITE_API_URL`. As respostas sao validadas com **Zod** antes de chegar nos componentes — se o backend mudar uma resposta sem atualizar o schema em `types/api/`, o service joga `ApiError("...formato inesperado.", 500)`.

Banners de artigo sao referenciados pelo backend como caminho relativo (`/articles/:id/banner`). O helper `getBannerUrl()` em `services/api.ts` prefixa com o `VITE_API_URL`.

### Endpoints consumidos

Autenticacao
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /auth/me`

Artigos
- `GET /articles`
- `GET /articles/:id`
- `GET /articles/:id/banner`
- `POST /articles` (multipart com banner)
- `PUT /articles/:id`
- `DELETE /articles/:id`

Categorias
- `GET /articles/categories`
- `POST /articles/categories`
- `PUT /articles/categories/:id`
- `DELETE /articles/categories/:id`

Comentarios e engajamento
- `GET /articles/:id/comments`
- `POST /articles/:id/comments`
- `POST /articles/:id/view`
- `POST /articles/:id/read`
- `GET /articles/:id/like`
- `POST /articles/:id/like`
- `DELETE /articles/:id/like`

Perfil
- `GET /profile/me`
- `PUT /profile/me`
- `GET /profile/me/dashboard`

## Persistencia de sessao

Apenas o token JWT fica em `localStorage` (`mind_blog_token`). O payload do token carrega o user publico (id, name, email, bio, avatarUrl, role), entao o `AuthProvider` deriva o usuario decodificando o token no boot e revalida em background chamando `/auth/me` — se falhar, limpa a sessao automaticamente. Apos editar o perfil, o backend devolve um token novo com os dados atualizados.

## Features de UX

- **Tema claro/escuro persistente** via `ThemeContext` (`src/context/ThemeContext.tsx`). O toggle fica no header; preferencia inicial respeita `prefers-color-scheme` e e gravada em `localStorage`.
- **Auto-login apos reset de senha:** o endpoint `POST /auth/reset-password` retorna o token ja na resposta, entao apos definir a nova senha o usuario e redirecionado diretamente para `/dashboard`.
- **Busca client-side com debounce** na listagem de artigos e categorias, evitando refetch a cada tecla.
- **Persistencia de sessao por JWT** com hidratacao otimista (decodifica o token no boot) e revalidacao em background via `/auth/me`.
- **Empty states e error boundaries** dedicados em cada pagina, sem telas brancas.

## Observacoes

- Todas as strings de UI estao em portugues.
- Estilos vivem no `index.css` (Tailwind v4 + variaveis CSS). Nao ha `tailwind.config`.
- O fluxo de recuperacao de senha esta totalmente ligado ao backend (envio de email via Gmail SMTP). Apos definir a nova senha, o frontend ja autentica o usuario e redireciona para `/dashboard`.

## Cobertura dos requisitos do case

- Frontend em React + TypeScript: completo.
- Cadastro e login: completo.
- Rotas protegidas com persistencia de sessao: completo.
- CRUD de artigos com upload de banner: completo.
- Validacao client-side e server-side (Zod nas duas pontas): completo.

Recursos extras: categorias, comentarios, curtidas, registro de visualizacoes e tempo de leitura, perfil com bio/avatar, dashboard com metricas reais por artigo e fluxo de **recuperacao de senha por email com auto-login no reset**.
