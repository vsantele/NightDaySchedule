ARG PNPM_VERSION=7.27.0

FROM node:18-alpine as base
RUN apk add --no-cache libc6-compat && apk update
RUN npm i --global --no-update-notifier --no-fund pnpm@${PNPM_VERSION}
WORKDIR /app


FROM base as runner

COPY --chown=node:node /packages/db/package.json ./
COPY --chown=node:node /packages/db/prisma ./

CMD ["pnpm", "dlx", "prisma", "migrate", "deploy"]
