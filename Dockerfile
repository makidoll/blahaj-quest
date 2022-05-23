FROM node:lts

WORKDIR /app

ADD . .

RUN yarn

CMD [ "yarn", "start" ]