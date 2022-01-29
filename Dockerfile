FROM docker.io/node:16

WORKDIR /usr/src/app

COPY package*.json ./

ENV NODE_ENV production

RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npm", "start"]