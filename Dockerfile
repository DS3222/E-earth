# ---------- Build Frontend ----------
FROM node:18 AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ---------- Backend with Frontend ----------
FROM node:18 AS backend
WORKDIR /app

# backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

COPY backend/ ./

RUN mkdir -p /app/backend/public
COPY --from=build-frontend /app/frontend/dist /app/backend/public

EXPOSE 10000
CMD ["npm", "start"]
