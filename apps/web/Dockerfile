# See all todos in TODO.md
FROM node:18.15.0-bullseye AS builder

RUN npm i -g pnpm@7
RUN npm i -g turbo

WORKDIR /app
COPY . .

ENV NODE_ENV=production

RUN turbo prune --scope=web --docker
RUN pnpm i
RUN pnpm run build --filter=web

EXPOSE 8080

CMD pnpm run start:web
