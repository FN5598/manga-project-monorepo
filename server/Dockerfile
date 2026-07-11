FROM node:22-alpine AS base
WORKDIR /app

ENV CI=true

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

FROM base AS build

COPY tsconfig.json tsconfig.build.json ./
COPY src ./src

RUN pnpm run build

FROM node:22-alpine AS development
WORKDIR /app

ENV NODE_ENV=development
ENV CI=true
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY --from=build /app/dist ./dist
EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]

FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV CI=true
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/dist ./dist
EXPOSE 4000

CMD ["node", "dist/main.js"]
