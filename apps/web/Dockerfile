# See all todos in TODO.md
FROM node:18.15.0-bullseye AS builder
# Arg required for railway config
ARG NEXT_PUBLIC_API_URL

RUN npm i -g pnpm@7
RUN npm i -g turbo

WORKDIR /app
COPY . .

RUN turbo prune --scope=web --docker
RUN pnpm i
RUN pnpm run build --filter=web

EXPOSE 8080
ENV NODE_ENV=production

CMD pnpm run start:web
