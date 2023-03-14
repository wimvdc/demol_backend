# Run

```bash
npm run dev
```

# Build & deploy

```bash
docker-compose --env-file .env build mol-backend
docker-compose up -d mol-backend
```

## .env

```
PORT=
DB_USERNAME=
DB_PASSWORD=
DB_SCHEMA=
# DB_HOST=
# DB_PORT=
DB_HOST=
DB_PORT=

WEB_BASE_URL=
SERVER_URL=

FB_AUTH_CLIENT_ID=
FB_AUTH_CLIENT_SECRET=
FB_AUTH_CALLBACK=

GOOGLE_AUTH_CLIENT_ID=
GOOGLE_AUTH_CLIENT_SECRET=
GOOGLE_AUTH_CALLBACK=
```
