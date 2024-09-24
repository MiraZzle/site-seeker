# build stage
FROM node:21-alpine as build
WORKDIR /siteseeker/frontend
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# production stage
FROM nginx:1.25.0-alpine
COPY --from=build /siteseeker/frontend/build /usr/share/nginx/html
COPY --from=build /siteseeker/frontend/nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
