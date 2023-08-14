FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.15.8-alpine
COPY --from=0 /app/dist/front-end /usr/share/nginx/html
EXPOSE 80
