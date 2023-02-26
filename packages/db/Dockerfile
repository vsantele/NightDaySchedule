ARG PNPM_VERSION=7.27.0

FROM node:18-alpine as base
RUN apk add --no-cache curl && \
  curl -fsSL "https://github.com/pnpm/pnpm/releases/download/v7.27.0/pnpm-linuxstatic-x64" -o /bin/pnpm && chmod +x /bin/pnpm && \
  apk del curl
WORKDIR /app


FROM base as runner
RUN apk add --no-cache libc6-compat && apk update

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs
RUN chown -R nodejs:nodejs .
USER nodejs

COPY --chown=nodejs:nodejs /packages/db/package.json ./
COPY --chown=nodejs:nodejs /packages/db/prisma ./
CMD pnpm dlx prisma migrate deploy
