FROM node:18.15.0-bullseye AS builder
# RUN curl -f https://get.pnpm.io/v7.30.5.js | node - add --global pnpm
RUN npm i -g pnpm@7

# The web Dockerfile is copy-pasted into our main docs at /docs/handbook/deploying-with-docker.
# Make sure you update this Dockerfile, the Dockerfile in the web workspace and copy that over to Dockerfile in the docs.

# FROM node:alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
# RUN apk update
# Set working directory
WORKDIR /app
RUN npm i -g turbo
COPY . .
RUN turbo prune --scope=api --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:18.15.0-bullseye AS installer
RUN curl -f https://get.pnpm.io/v7.30.5.js | node - add --global pnpm

# RUN apk add --no-cache libc6-compat
# RUN apk update
WORKDIR /app

# First install dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm i

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
# ? STOP 
# COPY turbo.json turbo.json

# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM

# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN

# ? STOP 
# RUN pnpm turbo run build --filter=api...

# FROM node:alpine AS runner
# WORKDIR /app

# # Don't run production as root
# RUN addgroup --system --gid 1001 fastify
# RUN adduser --system --uid 1001 fastify
# USER fastify
# COPY --from=installer /app .

# CMD node apps/api/dist/index.js