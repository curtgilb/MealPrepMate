# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install
COPY . .
RUN npm run compile
CMD ["node", "./dist/index.js"]

