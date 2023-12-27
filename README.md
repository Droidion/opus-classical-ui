# Opus Classical UI

## Requirements

- Have Bun installed.
- Have REST API running.
- Work from folder `/ui`.
- Create `.env` file.

```dotenv
IMAGES_URL=https://lpgcohwobsgnzsuipjql.supabase.co/storage/v1/object/public/covers
PUBLIC_API_URL=http://localhost:3000
```

## Run locally

- `$ bun run dev`.

## Run in Docker

- `$ docker compose up`

## Deploy

- Authenticate to fly.io.
- From monorepo root run `$ make depoly_ui`.