# Mind Blog Frontend

Frontend em React, TypeScript e Vite para o case de estagio da Mind Group.

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

## Requisitos

- Node.js 24 e npm
- Backend Mind Blog API rodando (veja o repositorio do backend)

## Quick start

```bash
npm install
npm run dev
```

A aplicacao sobe em `http://localhost:5173`.

A URL da API ja vem configurada via `.env.example` com `VITE_API_URL=http://localhost:3333`. Se o backend rodar em outra origem, edite o `.env`:

```bash
cp .env.example .env
# ajuste VITE_API_URL conforme necessario
```

> **Importante:** suba o backend **antes** do `npm run dev` ou as paginas que dependem de dados (listagem, dashboard) vao renderizar empty states ate o backend ficar disponivel.

### Login pos-seed do backend

| Campo | Valor |
|---|---|
| Email | `john@example.com` |
| Senha | `123456` |

## Scripts npm

```bash
npm run dev      # vite dev server
npm run build    # tsc -b && vite build (type check faz parte do build)
npm run preview  # serve o build pra inspecao local
npm run lint     # eslint .
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
  hooks/                  # custom hooks
  lib/                    # helpers de formatacao
  data/                   # mocks para features ainda nao plugadas ao backend
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
