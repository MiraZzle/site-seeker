FROM node:18.18.0-alpine AS builder

WORKDIR /app

COPY package*.json .

RUN npm i -g npm
RUN npm install

COPY . .

RUN npm run build
RUN npm prune --prod

FROM node:18.8.0-alpine AS deployer

WORKDIR /app

COPY --from=builder /app/.svelte-kit/output build/
COPY --from=builder /app/package.json .

EXPOSE 3000

CMD [ "node", "build" ]