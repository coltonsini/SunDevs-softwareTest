# SunDevs Backend Test

This project is a **monorepo** containing a NestJS API and a React + Vite frontend. The backend acts as a **"colador"** (filter) — transforming raw provider payloads into clean, enriched JSON with a custom **Hype Level** metric. Both apps run together with a single command from the root.

---

## Project Structure

```
SunDevs-softwareTest/
├── package.json               ← Root: runs both apps together
├── README.md
├── .gitignore
│
├── backend/
│   ├── .env.example           ← Copy this → .env and fill in your values
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       ├── guards/
│       │   └── api-key.guard.ts
│       └── videos/
│           ├── mock-data.json
│           ├── videos.controller.ts
│           ├── videos.service.ts
│           └── videos.module.ts
│
└── frontend/
    ├── .env.example           ← Copy this → .env and fill in your values
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── Cartelera.tsx
        └── Cartelera.css
```

---

## Prerequisites

> **Before starting, make sure you have the following installed:**

1. **Node.js v18+ and npm** — Download from [nodejs.org](https://nodejs.org/).
2. **NestJS CLI**
   ```bash
   npm install -g @nestjs/cli
   ```
3. **Git** *(optional)* — Download from [git-scm.com](https://git-scm.com/).

---

## Steps to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/coltonsini/SunDevs-softwareTest.git
cd SunDevs-softwareTest
```

---

### 2. Configure Environment Variables

Each app ships with a `.env.example`. Copy it and fill in your values:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

Then open both `.env` files and set the same secret key in both:

**`backend/.env`**
```env
API_KEY=your_secret_key_here
PORT=3000
FRONTEND_URL=http://localhost:5173
SWAGGER_ENABLED=true
```

**`frontend/.env`**
```env
VITE_API_KEY=your_secret_key_here
```

> ⚠️ `API_KEY` and `VITE_API_KEY` must be **identical**. To generate a secure key run:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

### 3. Install Dependencies

From the **root** of the project:

```bash
npm run install:all
```

---

### 4. Run Both Apps

```bash
npm run dev
```

| Color | App | URL |
|-------|-----|-----|
| 🔵 Cyan | Backend (NestJS) | http://localhost:3000 |
| 🟣 Magenta | Frontend (React) | http://localhost:5173 |

---

## API Documentation (Swagger)

With the backend running, open:

```
http://localhost:3000/docs
```

1. Click **Authorize** (top right)
2. Enter your `API_KEY` value
3. Click **Try it out** on any endpoint → **Execute**

> To disable Swagger in production, set `SWAGGER_ENABLED=false` in `backend/.env`.

---

## API Reference

### `GET /api/videos`

**Required header:**
```
x-api-key: your_secret_key_here
```

**Quick test with curl:**
```bash
curl -X GET http://localhost:3000/api/videos \
  -H "x-api-key: your_secret_key_here"
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

Modifiers:
- Title contains `"tutorial"` (case-insensitive) → hype × 2
- Comments disabled (property absent) → hype = 0

---

## Root `package.json`

```json
{
  "name": "sundevs-softwaretest",
  "scripts": {
    "dev": "concurrently --names \"BACKEND,FRONTEND\" --prefix-colors \"cyan,magenta\" \"npm run start:dev --prefix backend\" \"npm run dev --prefix frontend\"",
    "install:all": "npm install --prefix backend && npm install --prefix frontend"
  },
  "devDependencies": {
    "concurrently": "8.2.0"
  }
}
```

---

## Environment Variables Reference

| Variable | File | Description | Required |
|----------|------|-------------|----------|
| `API_KEY` | `backend/.env` | Secret key validated on every request | ✅ Yes |
| `PORT` | `backend/.env` | NestJS server port (default: `3000`) | ❌ Optional |
| `FRONTEND_URL` | `backend/.env` | Allowed CORS origin | ❌ Optional |
| `SWAGGER_ENABLED` | `backend/.env` | Set `false` to hide docs in production | ❌ Optional |
| `VITE_API_KEY` | `frontend/.env` | Same secret, sent in `x-api-key` header | ✅ Yes |

---

## Security

| Layer | Details |
|-------|---------|
| **API Key Guard** | Custom `ApiKeyGuard` — no extra install, uses `@nestjs/common` |
| **HTTP Headers** | `helmet` — activated with `app.use(helmet())` in `main.ts` |
| **CORS** | Restricted to `FRONTEND_URL`. Update for production. |
| **Swagger in prod** | Set `SWAGGER_ENABLED=false` to disable public docs. |
| **Secrets** | All keys in `.env` files (gitignored). Use `.env.example` as template. |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `EADDRINUSE` on port 3000 or 5173 | Run `lsof -i :3000` and kill the process, or change `PORT` in `backend/.env`. |
| `401 Unauthorized` | Confirm `API_KEY` matches `VITE_API_KEY`. Restart both servers after editing `.env`. |
| CORS error in browser | Confirm `FRONTEND_URL` in `backend/.env` matches the URL where React is running. |
| Frontend shows "Error del servidor" | Check the backend is running and the `x-api-key` header is being sent. |
| `npm run dev` only starts one app | Run `npm install` from the project root to install `concurrently`. |
| Swagger not loading | Check `SWAGGER_ENABLED` is not `false` and `@nestjs/swagger` is installed. |