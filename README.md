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

Autenticacao
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Artigos
- `GET /articles`
- `GET /articles/:id`
- `GET /articles/:id/banner`
- `POST /articles`
- `PUT /articles/:id`
- `DELETE /articles/:id`

Categorias
- `GET /articles/categories`
- `POST /articles/categories`
- `PUT /articles/categories/:id`
- `DELETE /articles/categories/:id`

Comentarios
- `GET /articles/:id/comments`
- `POST /articles/:id/comments`

Engajamento
- `POST /articles/:id/view`
- `POST /articles/:id/read`
- `GET /articles/:id/like`
- `POST /articles/:id/like`
- `DELETE /articles/:id/like`

Perfil
- `GET /profile/me`
- `PUT /profile/me`
- `GET /profile/me/dashboard`

As respostas e payloads principais sao validados com Zod na camada de services antes de serem usados pela interface. As chamadas HTTP usam uma instancia centralizada do Axios configurada por `VITE_API_URL`.

## Observacoes

Todos os recursos exibidos pela interface (artigos, comentarios, curtidas, visualizacoes, tags, categorias, perfil e metricas do dashboard) consomem dados reais do backend. Quando a API esta indisponivel, as paginas mostram empty states em vez de dados ficticios.

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

Recursos extras ja entregues alem do minimo: categorias, comentarios, curtidas, registro de visualizacoes e tempo de leitura, perfil de usuario com bio/avatar e dashboard com metricas reais por artigo.
