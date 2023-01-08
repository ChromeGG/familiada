#FROM node:18.6.0-bullseye-slim as builder
#ARG PNPM_VERSION=7.13.4
#RUN npm --global install pnpm@${PNPM_VERSION}
#ENV PRISMA_SKIP_POSTINSTALL_GENERATE=1
#
#WORKDIR /app
#RUN pnpm i -g turbo
#COPY . .
#RUN turbo prune --scope=web --docker
## COPY ../../packages /app/packages
## COPY ../../package.json /app/package.json
## COPY ../../pnpm-lock.yaml /app/pnpm-lock.yaml
## COPY ../../pnpm-workspace.yaml /app/pnpm-workspace.yaml
#
## COPY ../../turbo.json /app/turbo.json
#
## RUN pnpm install -r --offline --prod
#
## EXPOSE 3000
## CMD [ "pnpm", "run", "start:api" ]


FROM node:18.6.0-bullseye-slim

COPY scratch.js .
EXPOSE 8083

CMD [ "node", "scratch.js" ]