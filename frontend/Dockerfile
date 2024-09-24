FROM node:18.18.0-alpine AS builder

WORKDIR /siteseeker/frontend

COPY package*.json .

RUN npm i -g npm
RUN npm install

COPY . .

RUN npm run build
RUN npm prune --prod

FROM node:18.8.0-alpine AS deployer

WORKDIR /siteseeker/frontend

COPY --from=builder /siteseeker/frontend/.svelte-kit/output build/
COPY --from=builder /siteseeker/frontend/package.json .

EXPOSE 5173

CMD [ "node", "build" ]