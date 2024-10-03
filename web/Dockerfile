
FROM node:22-alpine as base

WORKDIR /usr/src/app
EXPOSE 3000

FROM base as dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
COPY . .
CMD npm run dev

FROM base as prod
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npm run build
USER node

CMD npm start
