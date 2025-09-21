# Build frontend
FROM node:18 AS build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Backend
FROM node:18
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install
COPY backend ./backend
COPY --from=build /app/frontend/dist ./frontend/dist

WORKDIR /app/backend
CMD ["node", "server.js"]
