# Build client
FROM node:18-alpine AS client-builder
WORKDIR /app/client
COPY client/package.json client/package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY client/ .
RUN npm run build

# Build server
FROM node:18-alpine AS server-builder
WORKDIR /app/server
COPY server/package.json server/package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY server/ .
# copy built client into server/dist
COPY --from=client-builder /app/client/dist ./dist

EXPOSE 8787
ENV PORT 8787
CMD ["node", "index.js"]
