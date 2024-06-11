FROM alpine:latest

RUN apk add --no-cache nodejs npm && npm i -g pnpm

WORKDIR /app

ADD package.json pnpm-lock.yaml /app/
RUN pnpm install --frozen-lockfile

ADD . .
RUN pnpm build

CMD pnpm serve