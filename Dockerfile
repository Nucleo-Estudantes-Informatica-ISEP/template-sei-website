# syntax=docker/dockerfile:1

FROM node:26-alpine AS deps
WORKDIR /app
RUN npm install --global corepack@0.34.5 && corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,sharing=locked \
  pnpm config set store-dir /pnpm/store && \
  pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm build

FROM nginxinc/nginx-unprivileged:1.31-alpine AS runner
USER root
RUN apk add --no-cache curl
USER nginx

COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl --fail --silent http://127.0.0.1:8080/ > /dev/null || exit 1
