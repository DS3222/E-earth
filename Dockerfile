# Stage 1 - build client
FROM node:18 AS builder
WORKDIR /app
COPY client/package.json ./client/
WORKDIR /app/client
RUN npm install --no-audit --no-fund
COPY client/ .
RUN npm run build

# Stage 2 - runtime
FROM node:18-slim
WORKDIR /app
COPY server/package.json ./server/
WORKDIR /app/server
RUN npm install --no-audit --no-fund
COPY server/ ./server
COPY --from=builder /app/client/dist ./server/dist
WORKDIR /app/server
ENV PORT 10000
EXPOSE 10000
CMD ["node","index.js"]

