FROM rockylinux:9

RUN dnf install -y nodejs && npm i -g yarn

WORKDIR /app

ADD package.json yarn.lock /app/
RUN yarn install

ADD . .
RUN yarn build

CMD yarn serve