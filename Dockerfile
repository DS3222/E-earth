FROM node:18

WORKDIR /app

# Copy backend
COPY backend/ ./backend

WORKDIR /app/backend

# Install dependencies (backend only, frontend is prebuilt)
RUN npm install express

EXPOSE 10000
CMD ["node", "server.js"]
