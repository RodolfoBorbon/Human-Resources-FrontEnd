FROM node:latest
WORKDIR /app
COPY package*.json server.js ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]

