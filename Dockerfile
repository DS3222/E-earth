FROM node:18
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./
COPY backend/dist ./dist
EXPOSE 10000
CMD [ "node", "server.js" ]
