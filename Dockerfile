
FROM node:21-alpine
WORKDIR /home/node/app
COPY package.json .
COPY yarn.lock .
COPY .yarnrc.yml .
COPY .yarn/ .yarn/
COPY . .
RUN yarn install
ENV NODE_ENV=production
ENTRYPOINT [ "yarn" ]

CMD [ "start" ]
