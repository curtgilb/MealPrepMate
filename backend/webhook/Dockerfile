FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

COPY . .
COPY ./server/prisma/schema.prisma .

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev
RUN npm run generate
# Bundle app source

EXPOSE 3000
CMD [ "node", "index.js" ]