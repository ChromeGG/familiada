# See all todos in TODO.md
FROM node:18.15.0-bullseye AS builder

RUN npm i -g pnpm@7
RUN npm i -g turbo

WORKDIR /app
COPY . .

RUN turbo prune --scope=api --docker
RUN pnpm i
RUN pnpm run build --filter=api

ENV NODE_ENV=production
EXPOSE 3000

CMD pnpm run start:api
