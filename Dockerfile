FROM node:18
WORKDIR /app/backend

# install backend deps
COPY backend/package*.json ./
RUN npm install --production

# copy backend source
COPY backend/ ./

# copy prebuilt frontend (dist) into backend/dist (already present in repo)
COPY backend/dist ./dist

EXPOSE 10000
CMD [ "node", "server.js" ]
