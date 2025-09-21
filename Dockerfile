
FROM node:18

WORKDIR /app

# Install backend deps
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Install frontend deps and build
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# Copy backend server
COPY backend ./backend

WORKDIR /app/backend

CMD ["npm", "start"]
