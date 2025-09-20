# Step 1: Build frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Step 2: Setup backend
FROM node:18
WORKDIR /app
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copy backend code
COPY backend/ ./ 

# Copy built frontend into backend/public
COPY --from=frontend-build /app/frontend/build ./public

EXPOSE 10000
CMD ["node", "server.js"]
