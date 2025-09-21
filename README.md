# E-earth (Full stack) — Ready for Render

This project contains a React frontend and a Node backend that uses Wikipedia for search results.

## Quick local run (development)

1. Install Node >= 18.
2. Seed local sqlite DB for server:
   - `cd server && npm install && npm run seed`
3. Start dev server:
   - `cd server && npm start`
4. Start frontend dev server:
   - `cd client && npm install && npm run dev`

The frontend expects the backend at the path specified in `VITE_API_URL` for production. In development, client uses relative path to `http://localhost:8787` if you run the server and client separately — or set `VITE_API_URL` in `.env`.

## Deploying to Render (one-click)

1. Create a GitHub repo with this project (or drag & drop the zip to Render).
2. Render will create two services and a Postgres DB from `render.yaml`:
   - `e-earth-backend` (Node web service)
   - `e-earth-frontend` (Static site)
   - `e-earth-db` (Postgres)
3. The backend will use the Postgres connection string (`DATABASE_URL`) automatically provided by Render.

See `render.yaml` for details.
