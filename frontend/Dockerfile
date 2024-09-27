FROM node:20.11-alpine

WORKDIR /siteseeker/frontend

COPY package*.json ./

RUN npm i -g npm
RUN npm ci

COPY . .

RUN npm run build && npm prune --production

ENV PORT=5050

EXPOSE 5050

CMD ["node", "build"]