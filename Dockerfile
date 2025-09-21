# Stage 1 — build frontend
FROM node:18 AS build-frontend
WORKDIR /app/frontend

# install deps
COPY frontend/package*.json ./
RUN npm install

# copy rest of frontend and build
COPY frontend/ ./
RUN npm run build

# Stage 2 — backend runtime
FROM node:18
WORKDIR /app/backend

# install backend deps
COPY backend/package*.json ./
RUN npm install

# copy backend source
COPY backend/ ./

# ✅ copy frontend dist directly into /app/backend/dist
COPY --from=build-frontend /app/frontend/dist ./dist

EXPOSE 10000
CMD ["node", "server.js"]
