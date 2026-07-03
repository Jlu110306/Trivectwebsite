# Trivect Quote API

Small Node/Express service that powers:

- **Quote / information submissions** from the website (`POST /api/quote`)
- **Admin dashboard** at `/admin` on the website (login → list quotes, change status, delete, reply by email, view customer accounts)

Quotes are stored as a JSON file at `data/quotes.json`. There is no database dependency.

## Setup on the server

1. Place this folder somewhere on the server, e.g. `/opt/trivect-quote-api/`.
2. Install deps: `cd /opt/trivect-quote-api && npm install --omit=dev`
3. Pick a strong admin password and a long random JWT secret. Set them in a systemd unit or `.env`:
   ```
   ADMIN_PASSWORD=<your-strong-password>
   JWT_SECRET=<at-least-32-random-chars>
   PORT=3001
   CORS_ORIGIN=https://trivect-aerospace.space
   AUTH_API_BASE=http://127.0.0.1:3000   # optional, for customer-account listing
   AUTH_ADMIN_TOKEN=<admin-token-for-existing-auth-backend>  # optional
   ```
4. Run it. Recommended: a systemd service or `pm2 start server.js --name trivect-quote-api`.
5. Reverse-proxy `/api/*` from your existing nginx/caddy to `127.0.0.1:3001`, or run this on the same origin as the SPA (default `CORS_ORIGIN=*` in dev).

## Endpoints

| Method | Path                       | Auth     | Purpose                            |
|--------|----------------------------|----------|------------------------------------|
| GET    | `/api/health`              | public   | Health check                       |
| POST   | `/api/quote`               | public   | Submit a quote/information request |
| POST   | `/api/admin/login`         | public   | Admin login → returns JWT          |
| GET    | `/api/admin/quotes`        | bearer   | List all quotes                    |
| PATCH  | `/api/admin/quotes/:id`    | bearer   | Update status (new/contacted/in_progress/closed) |
| DELETE | `/api/admin/quotes/:id`    | bearer   | Delete a quote                     |
| GET    | `/api/admin/users`         | bearer   | List customer accounts (proxies your existing auth backend if `AUTH_API_BASE` is set) |

Quote request body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "information": "I need a custom drone with thermal camera",
  "service": "Aerospace & Custom Drones"
}
```

## Admin login

The admin is a single hard-coded account (no signup). Default email is `luj_ceo-founder@trivect-aerospace.space` — change it via `ADMIN_EMAIL` env var if needed.

Visit `https://your-site.com/admin` to sign in. The JWT lasts 8 hours.

## Customer accounts

The website already has an auth backend (the one `/api/login`, `/api/register`, `/api/profile` go to). To make the dashboard show the user list, set:

- `AUTH_API_BASE` — URL of the existing backend, e.g. `http://127.0.0.1:3000`
- `AUTH_ADMIN_TOKEN` — bearer token that backend trusts for `/admin/users`

If the existing backend doesn't have an `/admin/users` endpoint yet, this returns 404 and the dashboard shows "User endpoint not configured". To add it, expose a route that returns `[{ id, name, email, created_at }]` and trusts the token. Until then, the rest of the dashboard works fine.

## Storage

Quotes are written atomically (`fs.rename`) to `data/quotes.json`. The file is created on first start if missing. Back it up regularly, or migrate to SQLite later by adding a `better-sqlite3` dependency and swapping the `readQuotes`/`writeQuotes` functions — the route handlers don't need to change.

## Files

```
trivect-quote-api/
├── server.js          # the whole API
├── package.json       # express + cors, no native deps
├── data/
│   └── quotes.json    # created on first quote submission
└── README.md
```