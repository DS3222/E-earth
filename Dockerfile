# ---------- Build stage ----------
FROM node:18 AS build
WORKDIR /app

# Copy frontend and build it
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# ---------- Production stage ----------
FROM node:18
WORKDIR /app

# Copy backend
COPY backend ./backend

# Copy built frontend dist into backend so Express can serve it
COPY --from=build /app/frontend/dist ./backend/frontend/dist

WORKDIR /app/backend
RUN npm install

# Start backend
CMD ["node", "server.js"]
