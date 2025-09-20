# Stage 1: Build frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Stage 2: Backend
FROM node:18
WORKDIR /app
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend code
COPY backend ./backend

# Copy built frontend into backend/public
COPY --from=frontend-build /app/frontend/dist ./backend/public

WORKDIR /app/backend
EXPOSE 10000
CMD ["node", "index.js"]
