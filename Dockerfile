# ===========================
# Stage 1: Build frontend
# ===========================
FROM node:18 AS frontend-build
WORKDIR /app/frontend

# Install dependencies
COPY frontend/package*.json ./
RUN npm install

# Copy source and build
COPY frontend/ ./
RUN npm run build

# ===========================
# Stage 2: Setup backend
# ===========================
FROM node:18
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copy backend code
COPY backend/ ./

# Copy frontend build output into backend/public
COPY --from=frontend-build /app/frontend/dist ./public

EXPOSE 10000
CMD ["node", "server.js"]
