FROM rockylinux:9

RUN dnf install -y nodejs && npm i -g pnpm

WORKDIR /app

ADD package.json pnpm-lock.yaml /app/
RUN pnpm install --frozen-lockfile

ADD . .
RUN pnpm build

CMD pnpm serve