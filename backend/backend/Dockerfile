# Use Node.js
FROM node:18

# Set working directory
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Install frontend dependencies and build
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# Copy backend source
COPY backend ./backend

# Expose port
EXPOSE 10000

# Start server
CMD ["node", "backend/server.js"]
