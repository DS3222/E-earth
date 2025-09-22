# Stage 1 - Build React frontend
FROM node:18 as build
WORKDIR /app
COPY client ./client
WORKDIR /app/client
RUN npm install
RUN npm run build

# Stage 2 - Setup server
FROM node:18
WORKDIR /app
COPY server ./server
COPY --from=build /app/server/dist ./server/dist
WORKDIR /app/server
RUN npm install

EXPOSE 10000
CMD ["npm", "start"]
