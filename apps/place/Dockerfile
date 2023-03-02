ARG PNPM_VERSION=7.28.0

FROM node:18-alpine as base
RUN apk add --no-cache libc6-compat && apk update
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  npm i --global --no-update-notifier --no-fund pnpm@${PNPM_VERSION} \
  && pnpm fetch turbo
WORKDIR /usr/app


FROM base as builder

COPY . .
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm dlx turbo prune --scope=place --docker

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
  pnpm dlx turbo run build --filter=place

FROM installer as pruned
RUN --mount=type=cache,id=pnpm-store,target=/root/.pnpm-store \
  pnpm --filter place --prod deploy ./pruned

FROM base AS runner

ENV NODE_ENV production

RUN mkdir -p /var/logs/place && chown -R node:node /var/logs/place

COPY --from=pruned --chown=node:node /usr/app/pruned/dist dist
COPY --from=pruned --chown=node:node /usr/app/pruned/node_modules node_modules

RUN which crond && \
  rm -rf /etc/periodic

RUN echo "* * */10 * * cd /usr/app && node dist" > /var/spool/cron/crontabs/node

USER node
CMD ["crond", "-f", "-l", "2"]