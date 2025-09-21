# -------- Stage 1: Build Frontend --------
FROM node:18 AS build-frontend
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# -------- Stage 2: Run Backend --------
FROM node:18
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend/ ./

# ✅ copy built frontend into backend/dist
COPY --from=build-frontend /app/frontend/dist ./dist

EXPOSE 10000
CMD ["node", "server.js"]
