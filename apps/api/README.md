# GraphQL Server with Fastify, GraphQL Yoga, Pothos and Prisma

## TODO: Update all these things

This repo shows how to build a GraphQL server with TypeScript and the following technologies:

- [**Fastify**](https://www.fastify.io/): Fast and low overhead web framework, for Node.js
- [**Prisma**](https://www.prisma.io/): Next-generation ORM for type-safe interaction with the database
- [**PostgreSQL**](https://www.postgresql.org/): powerful, open source object-relational database system with over 30 years of active development.

The project is written in TypeScript and attempts to maintain a high degree of type-safety by leveraging Prisma and GraphQL.

## DB Schema

The database schema is defined using the [Prisma schema](./prisma/schema.prisma) which defines 3 models:



## GraphQL schema

The GraphQL schema is defined with Nexus using the [code-first approach](https://www.prisma.io/blog/the-problems-of-schema-first-graphql-development-x1mn4cb0tyl3).

The relevant files are:

- [./src/schema.ts](./src/schema.ts): Source of truth for the schema in TypeScript
- [./schema.graphql](./schema.graphql): Generated GraphQL scehma

## Getting started

### Prerequisites

- A PostgreSQL DB

### Steps

1. clone repo
2. create `.env` file and define `DATABASE_URL` and `SENTRY_DSN`
3. `npm install`
4. `npm run migrate:dev` to run schema migrations with [Prisma Migrate](https://www.prisma.io/migrate)
5. `npm run dev` to start dev server and run the API
