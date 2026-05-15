# Mind Blog Frontend

Frontend em React, TypeScript e Vite para o case de estagio da Mind Group.

## Tecnologias

- React
- TypeScript
- Vite
- React Router
- Axios
- Zod
- Tailwind CSS
- lucide-react

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

3. Garanta que o backend esteja rodando em `http://localhost:3333`.

4. Inicie o frontend:

```bash
npm run dev
```

## Rotas

- `/` - home
- `/artigos` - listagem de artigos com grid/lista e busca
- `/artigos/:id` - detalhe do artigo
- `/login` - login
- `/cadastro` - cadastro
- `/dashboard` - area protegida
- `/artigos/novo` - criacao de artigo
- `/artigos/:id/editar` - edicao de artigo
- `/configuracoes` - tela visual de configuracoes

## Integracao com backend

Configure a URL da API em `.env`:

```bash
VITE_API_URL=http://localhost:3333
```

O frontend consome:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /articles`
- `GET /articles/:id`
- `POST /articles`
- `PUT /articles/:id`
- `DELETE /articles/:id`
- `GET /articles/:id/banner`

As respostas e payloads principais sao validados com Zod na camada de services antes de serem usados pela interface. As chamadas HTTP usam uma instancia centralizada do Axios configurada por `VITE_API_URL`.

## Observacoes

Comentarios, curtidas, visualizacoes, tags, categorias, metricas e configuracoes de perfil aparecem como UI temporaria porque ainda nao existem no backend. O CRUD minimo de artigos, autenticacao e upload de banner estao integrados.

## Cobertura dos requisitos do case

- Frontend em React com TypeScript: completo.
- Backend em Node.js, Express e TypeScript: completo no repositorio backend.
- Banco MySQL: completo no repositorio backend via Docker Compose.
- ORM Prisma: completo no repositorio backend.
- Cadastro e login de usuarios: completo.
- Usuario com nome, email e senha: completo.
- Senhas criptografadas com bcrypt: completo no backend.
- Artigos com titulo, conteudo, autor, data de publicacao, data de alteracao e banner: completo.
- Criacao, edicao e remocao protegidas por login: completo.
- Banner salvo como BLOB: completo no backend, consumido pelo endpoint `/articles/:id/banner`.
- Dump SQL: completo no repositorio backend.
- Repositorios e commits organizados: completo localmente.

Recursos visuais ainda mockados por nao fazerem parte do minimo obrigatorio: comentarios, curtidas, visualizacoes, tags, categoria real, perfil, configuracoes e metricas do dashboard.
