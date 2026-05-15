# Mind Blog Frontend

Frontend em React, TypeScript e Vite para o case de estagio da Mind Group.

## Tecnologias

- React
- TypeScript
- Vite
- React Router
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

## Observacoes

Comentarios, curtidas, visualizacoes, tags, categorias, metricas e configuracoes de perfil aparecem como UI temporaria porque ainda nao existem no backend. O CRUD minimo de artigos, autenticacao e upload de banner estao integrados.
