E-earth — fixed for Render Docker build

This repo includes a Dockerfile so Render can build a single Docker image that contains both the backend and bundled frontend.
When deployed as the `e-earth-backend` docker web service, the server will serve the built client from server/dist.

Quick local test:
1. Build: docker build -t e-earth:local .
2. Run: docker run -p 8787:8787 -e PORT=8787 e-earth:local
3. Open http://localhost:8787 and test /api/search?q=motherboard

Alternatively, use render.yaml to deploy the backend (docker) and frontend (static) as separate services.
