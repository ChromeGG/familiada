# GraphQL Server with Fastify, Mercurius, Prisma, and Nexus Example

This repo shows how to build a GraphQL server with TypeScript and the following technologies:

- [**Fastify**](https://www.fastify.io/): Fast and low overhead web framework, for Node.js
- [**Mercurius**](https://mercurius.dev/): GraphQL adapter for Fastify
- [**Nexus**](https://nexusjs.org/): Declarative, Code-First GraphQL Schemas for JavaScript/TypeScript
- [**nexus-prisma**](https://github.com/prisma/nexus-prisma/): Plugin that allows projecting types from your Prisma schema to the GraphQL schema
- [**Prisma**](https://www.prisma.io/): Next-generation ORM for type-safe interaction with the database
- [**PostgreSQL**](https://www.postgresql.org/): powerful, open source object-relational database system with over 30 years of active development.
<!-- - [**Sentry**](https://sentry.io/): an error tracking and monitoring tool. -->
- [**Altair GraphQL**](https://altair.sirmuel.design/): GraphQL Web Client (similar to GraphQL Playground)

The project is written in TypeScript and attempts to maintain a high degree of type-safety by leveraging Prisma and GraphQL.

Play with a deployed version of this API: https://fastify-prisma.up.railway.app/altair

## Deploy it! 🚢

[![Deploy on Railway 🚊](https://railway.app/button.svg)](https://railway.app/new?template=https%3A%2F%2Fgithub.com%2F2color%2Ffastify-graphql-nexus-prisma&plugins=postgresql&envs=SENTRY_DSN&optionalEnvs=SENTRY_DSN)

## DB Schema

The database schema is defined using the [Prisma schema](./prisma/schema.prisma) which defines 3 models:

- User
- Post
- Comment

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
4. `npm run migrate:dev` to run shcema migrations with [Prisma Migrate](https://www.prisma.io/migrate)
5. `npm run dev` to start dev server and run the API

### Example trace

![trace example](https://user-images.githubusercontent.com/1992255/123289101-6c69d400-d510-11eb-9154-8aa0bdb8d10c.png)
