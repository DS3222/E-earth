# Stage 1 - build frontend (Vite)
FROM node:18 AS frontend-build
WORKDIR /app/frontend
# install frontend deps (cache friendly)
COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps
# copy frontend source and build
COPY frontend/ .
RUN npm run build

# Stage 2 - backend runtime
FROM node:18
WORKDIR /app
# copy backend package and install deps
COPY backend/package*.json /app/backend/
WORKDIR /app/backend
RUN npm install --legacy-peer-deps
# copy backend source
COPY backend/. /app/backend/
# copy frontend build (dist) into backend
COPY --from=frontend-build /app/frontend/dist /app/backend/frontend
WORKDIR /app/backend
CMD ["node", "server.js"]
