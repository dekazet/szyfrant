FROM node:18-alpine AS build

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app
COPY --from=build /app/src/server ./
COPY --from=build /app/build ./build

EXPOSE 3001
ENV PORT=3001

CMD ["node", "server.js"]
