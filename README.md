# E-earth 🌍

Google-like search engine powered by Wikipedia API.

## Features
- Search any topic (live results from Wikipedia)
- Single Render service (backend + frontend in Docker)
- Ads section placeholder (for Google AdSense)

## Run locally
```
docker build -t e-earth .
docker run -p 10000:10000 e-earth
```
Visit: http://localhost:10000
