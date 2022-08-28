# Familiada

[Familiada](https://en.wikipedia.org/wiki/Familiada) is a polish clone of [Family Feud](https://en.wikipedia.org/wiki/Family_Feud) 🙂

## What's inside?

This turborepo uses [pnpm](https://pnpm.io) as a packages manager. It includes the following apps/packages:

- `api`: a [Fastify](https://www.fastify.io/) backend
- `web`: a [Next.js](https://nextjs.org) frontend

- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is:

- written in TypeScript and extends common config from `packages/tsconfig`,
- linted by ESLint and extends common config from `packages/eslint-config-custom`,
- pure ESM,
- documented by local `README.md`

## Get started

### Develop locally

1. Install all dependencies `pnpm i`
2. Copy `.env.example` => `.env` in each `/apps`
3. Run `docker-compose up`
4. Run `pnpm run dev`

TODO: add note/script about DB migrations

```bash
# api
http://127.0.0.1:3000/

# web
http://localhost:8080/

```

### Production build

To build all apps and packages, run the following command:

```bash
pnpm run build
```

TODO: Add docker image with production build
