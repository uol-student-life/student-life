# Stage 1: Builder
FROM node:18-alpine as builder
RUN apk update && apk upgrade
RUN apk add --update --no-cache git python3 make g++
WORKDIR /app
COPY package.json ./
RUN npm install && npm cache clean --force
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine as production
COPY --from=builder /app/.output /app/.output
ENV HOST=0.0.0.0
ENV PORT=80
EXPOSE 80
ENTRYPOINT ["node", "/app/.output/server/index.mjs" ]