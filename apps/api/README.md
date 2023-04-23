# API

A GraphQL server with the following technologies:

- [**Fastify**](https://www.fastify.io/)
- [**Prisma**](https://www.prisma.io/)
- [**GraphQL Yoga**](https://www.graphql-yoga.com/)
- [**Pothos**](https://pothos-graphql.dev/)
- [**PostgreSQL**](https://www.postgresql.org/)

The project is written in TypeScript and attempts to maintain a high degree of type-safety by leveraging Prisma, Pothos and GraphQL.

## Day to day work

Useful commands:

```bash

# (re)generate prisma client
pnpm prisma generate

pnpm run test <pattern>
```

Preview all Postgres logs
```sql
ALTER DATABASE familiada
SET log_statement = 'all';
-- use it in transaction or set it back to 'none' to revert changes
```

## Adding new migration

Do some changes in `prisma.schema`, then run:

```bash
pnpm migrate:dev
```