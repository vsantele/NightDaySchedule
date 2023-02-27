ARG PNPM_VERSION=7.27.1
ARG APP_NAME="api"

FROM node:18-alpine as base
RUN apk add --no-cache libc6-compat && apk update
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  npm i --global --no-update-notifier --no-fund pnpm@${PNPM_VERSION}
WORKDIR /usr/app

ARG APP_NAME="api"
FROM base as builder

COPY . .
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm dlx turbo prune --scope=$APP_NAME --docker

ARG APP_NAME="api"
FROM base as installer

COPY .gitignore .gitignore
COPY turbo.json turbo.json
COPY --from=builder /usr/app/out/json ./
COPY --from=builder /usr/app/out/pnpm-lock.yaml /usr/app/out/pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm install --frozen-lockfile
COPY --from=builder /usr/app/out/full ./

ENV NODE_ENV production
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm dlx turbo run build --filter=$APP_NAME

ARG APP_NAME="api"
FROM installer as pruned
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm --filter $APP_NAME --prod deploy ./pruned

FROM base AS runner.

ENV NODE_ENV production

COPY --from=pruned --chown=node:node /usr/app/pruned/dist dist
COPY --from=pruned --chown=node:node /usr/app/pruned/node_modules node_modules

EXPOSE 5173
USER node
CMD ["node", "dist"]