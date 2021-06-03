# install dependencies
FROM node:fermium-alpine
WORKDIR /app-src

RUN npm i -g pnpm

COPY assets ./assets

COPY package.json ./
RUN pnpm install

COPY src ./src
RUN pnpm run build

USER node

ENV PORT=3000
ENV API="bahn"

CMD ["npm", "start"]
