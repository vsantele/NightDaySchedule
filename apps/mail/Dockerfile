
FROM node:18-alpine as base
RUN wget -qO- https://get.pnpm.io/install.sh | ENV="~/.shrc" SHELL="$(which sh)" PNPM_VERSION=7.27.1 sh -
WORKDIR /usr


FROM base as builder

COPY package.json pnpm-lock.yaml ./

COPY tsconfig.json ./

COPY src ./src

RUN pnpm install
RUN pnpm prisma generate

RUN pnpm run build


## this is stage two , where the app actually runs

FROM base

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod

COPY --from=builder /usr/node_modules/.prisma /usr/node_modules/

COPY --from=builder /usr/dist .

CMD ["node","index.js"]