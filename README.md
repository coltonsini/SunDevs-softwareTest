# SunDevs Backend Test

This project is a **monorepo** containing a NestJS API and a React + Vite frontend. The backend acts as a **"colador"** (filter) — transforming raw provider payloads into clean, enriched JSON with a custom **Hype Level** metric. Both apps run together with a single command from the root.

---

## Project Structure

```
SunDevs-softwareTest/
├── package.json          ← Root package: runs both apps together
├── README.md
│
├── backend/              ← NestJS API (port 3000)
│   ├── .env              ← ⚠️ You must create this (not committed)
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       └── videos/
│           ├── mock-data.json
│           ├── videos.controller.ts
│           ├── videos.service.ts
│           └── videos.module.ts
│       └── guards/
│           └── api-key.guard.ts
│
└── frontend/             ← React + Vite app (port 5173)
    ├── .env              ← ⚠️ You must create this (not committed)
    └── src/
        ├── main.tsx
        ├── App.tsx
        └── Cartelera.tsx
```

---

## Prerequisites

> **Before starting, make sure you have the following installed:**

1. **Node.js v18+ and npm** — Download from [nodejs.org](https://nodejs.org/).

2. **NestJS CLI**
   ```bash
   npm install -g @nestjs/cli
   ```

3. **Git** *(optional, to clone the repo)* — Download from [git-scm.com](https://git-scm.com/).

---

## Steps to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/coltonsini/SunDevs-softwareTest.git
cd SunDevs-softwareTest
```

---

### 2. Configure Environment Variables

The backend and frontend each need a `.env` file. **These are not committed to Git**, so you must create them manually.

**`backend/.env`**
```env
API_KEY=your_secret_key_here
PORT=3000
```

**`frontend/.env`**
```env
VITE_API_KEY=your_secret_key_here
```

> ⚠️ Use the **same value** for `API_KEY` and `VITE_API_KEY`. This is the shared secret between both apps.
> Also you can use this website to generate a safe API_KEY to do the testing [api-key-generator](https://www.strongdm.com/tools/api-key-generator).

---

### 3. Install All Dependencies

From the **root** of the project, run:

```bash
npm run install:all
```

This installs dependencies for both `backend/` and `frontend/` in one step.

---

### 4. Run Both Apps Together

```bash
npm run dev
```

That's it. Both servers start in the same terminal with color-coded logs:

| Color | App | URL |
|-------|-----|-----|
| 🔵 Cyan | Backend (NestJS) | http://localhost:3000/api/videos |
| 🟣 Magenta | Frontend (React) | http://localhost:5173 |

> The `dev` command uses `concurrently` (installed as a root dev dependency) to run both apps in parallel.

---

### Running Apps Individually *(optional)*

If you need to run only one app at a time:

```bash
# Backend only
cd backend && npm run start:dev

# Frontend only
cd frontend && npm run dev
```

---

## Root `package.json` Reference

The root `package.json` must look like this for the commands above to work:

```json
{
  "name": "sundevs-backendtest",
  "scripts": {
    "dev": "concurrently --names \"BACKEND,FRONTEND\" --prefix-colors \"cyan,magenta\" \"npm run start:dev --prefix backend\" \"npm run dev --prefix frontend\"",
    "install:all": "npm install --prefix backend && npm install --prefix frontend"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

---

## Environment Variables Reference

| Variable | File | Description | Required |
|----------|------|-------------|----------|
| `API_KEY` | `backend/.env` | Secret key the backend validates on every request | ✅ Yes |
| `PORT` | `backend/.env` | Port for the NestJS server (default: `3000`) | ❌ Optional |
| `VITE_API_KEY` | `frontend/.env` | Same secret key, sent by React in the `x-api-key` header | ✅ Yes |

---

## API Reference

### `GET /api/videos`

Returns a clean, enriched list of videos sorted by Hype Level.

**Required header:**
```
x-api-key: your_secret_key_here
```

**Response example:**
```json
[
  {
    "id": "v001",
    "title": "Tutorial Completo de NestJS desde Cero",
    "author": "CodigoPro",
    "thumbnail": "https://...",
    "publishedAt": "Hace 2 meses",
    "hypeLevel": 0.1385
  }
]
```

**Hype Level formula:**
```
hypeLevel = (likes + comments) / views
```

**Business rule modifiers:**
- If the title contains `"tutorial"` (case-insensitive) → multiply hype × 2
- If comments are disabled (property absent) → hype = 0

---

## Security

| Layer | Implementation |
|-------|---------------|
| API Key guard | Custom `ApiKeyGuard` in `backend/src/guards/` — no extra install needed, uses `@nestjs/common` |
| HTTP security headers | `helmet` npm package (`npm install helmet` inside `backend/`) — activated with `app.use(helmet())` in `main.ts` |
| CORS | Restricted to `http://localhost:5173` in dev. Set `FRONTEND_URL` env var for production. |
| Secrets | All keys live in `.env` files, never in source code. Both `.env` files are in `.gitignore`. |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `EADDRINUSE` on port 3000 or 5173 | Another process is using the port. Run `lsof -i :3000` (or `:5173`) and kill it. |
| CORS error in browser | Confirm the backend is running and `enableCors` origin in `main.ts` matches your frontend URL. |
| `401 Unauthorized` | Check that `API_KEY` in `backend/.env` matches `VITE_API_KEY` in `frontend/.env`. |
| Frontend shows "Error del servidor" | Confirm the backend is running and the `x-api-key` header is being sent in `Cartelera.tsx`. |
| `npm run dev` only starts one app | Make sure `concurrently` is installed at the root: run `npm install` from the project root. |