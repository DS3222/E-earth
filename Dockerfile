FROM node:18 AS builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install --no-audit --no-fund || true
COPY client/ .
RUN npm run build

FROM node:18-slim
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --no-audit --no-fund || true
COPY server/ .
COPY --from=builder /app/client/dist ./dist
ENV PORT=10000
EXPOSE 10000
CMD ["node","index.js"]

