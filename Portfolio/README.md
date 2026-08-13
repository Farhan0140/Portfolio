# Portfolio

A database-backed personal portfolio: a polished public site at `/` and a password-protected admin dashboard at `/admin` for managing every section's content — no code changes required for normal updates.

- **Frontend:** Vite + React 19, React Router, Tailwind (admin UI) + a hand-built design system (public site)
- **Backend:** Go (chi router, GORM), Postgres (Neon)
- **Auth:** single shared password (`ADMIN_PASSWORD`), signed httpOnly session cookie

## Project layout

```
src/                  React app — public site (sections/, components/) + admin dashboard (admin/)
server/                Go backend
  cmd/api/              HTTP server entrypoint
  cmd/seed/              one-off DB seed script
  internal/
    config/               env loading
    database/              gorm connection + AutoMigrate
    models/                 GORM structs for every entity
    auth/                   login/session/rate-limit
    httpapi/                routes: generic CRUD, public aggregate endpoint, static file serving
```

## Local development

Requires Node 18+ and Go 1.22+, plus a Postgres database (e.g. a free [Neon](https://neon.tech) project).

1. Copy `.env.example` to `server/.env` and fill in `DATABASE_URL`, `ADMIN_PASSWORD`, and a generated `SESSION_SECRET` (`openssl rand -hex 32`).
2. Install frontend deps: `npm install`
3. Install Go deps: `cd server && go mod download`
4. Seed the database (creates tables and loads the starter content): `cd server && go run ./cmd/seed`
5. Run both dev servers (two terminals):
   ```
   cd server && go run ./cmd/api      # API on :8080
   npm run dev                         # Vite on :5173, proxies /api to :8080
   ```
6. Visit `http://localhost:5173` for the public site, `http://localhost:5173/admin` for the dashboard (log in with `ADMIN_PASSWORD`).

## Production build

The Go server serves both the API and the built frontend from one process:

```
npm run build              # outputs to dist/
cd server && go build -o portfolio-server ./cmd/api
./portfolio-server          # serves dist/ + /api on $PORT
```

Set `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, `APP_ENV=production` (and `ALLOWED_ORIGIN` to your real domain) as real environment variables on your host — never commit a `.env` file with real secrets.

## Adding a new dynamic section

1. Add a GORM model in `server/internal/models` (embed `models.Base` for repeatable/orderable content, or `models.IDBase` for a singleton).
2. Register it with `database.AutoMigrate`.
3. Mount it in `server/internal/httpapi/entities.go` with one line: `NewResource[models.YourType](db).Mount(r, "/your-path")`.
4. Add it to the aggregate payload in `server/internal/httpapi/public.go`.
5. Add a field-config array + `<CrudSection>` (or `<SingletonForm>`) page under `src/admin/pages`, and a link in `src/admin/AdminLayout.jsx`.
6. Read the data on the public site via `usePortfolioData()` (`src/context/PortfolioDataContext.jsx`).
