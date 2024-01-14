# Familiada

[Familiada](https://en.wikipedia.org/wiki/Familiada) is a polish clone of [Family Feud](https://en.wikipedia.org/wiki/Family_Feud) 🙂

## What's inside?

This turborepo uses [pnpm](https://pnpm.io) as a packages manager. It includes the following apps/packages:

- `api`: a [Fastify](https://www.fastify.io/) backend
- `web`: a [Next.js](https://nextjs.org) frontend

- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used through the monorepo

Each package/app is:

- written in TypeScript and extends common config from `packages/tsconfig`,
- linted by ESLint and extends common config from `packages/eslint-config-custom`,
- pure ESM,
- documented by local `README.md`

## Get started

### Develop locally

Run the following command to start the development environment:

```bash
$ dev
```

It will:

1. Install all the required tools
2. Install all dependencies `pnpm i`
3. Copy `.env.example` => `.env` in each `/apps`
4. Run `docker-compose up`
5. Run migrations `pnpm -w run migrate`
6. Run `pnpm run dev`

```bash
# api
http://localhost:3000/

# web
http://localhost:8080/

```

### Production build

To build all apps and packages, run the following command:

```bash
pnpm run build
```
