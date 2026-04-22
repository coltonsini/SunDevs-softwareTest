# SunDevs Backend Test

This project is a NestJS + ReactJS application designed to generate an API and consume it through the frontend to display YouTube video data. The backend acts as a **"colador"** (filter) — transforming raw provider payloads into clean, enriched JSON with a custom **Hype Level** metric.

---

## Project Structure

```
SunDevs-Backend-NestJS/
├── backend/          ← NestJS API (port 3000)
│   └── src/
│       ├── main.ts
│       ├── app.module.ts
│       └── videos/
│           ├── mock-data.json
│           ├── videos.controller.ts
│           ├── videos.service.ts
│           └── videos.module.ts
└── frontend/         ← React + Vite app (port 5173)
    └── src/
        ├── main.tsx
        ├── App.tsx
        └── Cartelera.tsx
```

---

## Prerequisites

> **Before starting, make sure you have the following installed:**

1. **Node.js v18+ and npm**
   Download from [nodejs.org](https://nodejs.org/).

2. **NestJS CLI**
   ```bash
   npm install -g @nestjs/cli
   ```

3. **Git** *(optional, to clone the repo)*
   Download from [git-scm.com](https://git-scm.com/).

---

## Steps to Run the Project

### 1. Clone the Repository

```bash
git clone https://github.com/coltonsini/SunDevs-Backend-NestJS.git
cd SunDevs-Backend-NestJS
```

---

### 2. Run the Backend (NestJS)

Navigate to the backend folder, install dependencies and start the server:

```bash
cd backend
npm install
npm run start:dev
```

The API will be available at:
```
http://localhost:3000/api/videos
```

> **Note:** `start:dev` enables hot-reload so the server restarts automatically on file changes. Use `npm run start` for a standard run without hot-reload.

---

### 3. Configure the API Key *(Security)*

The endpoint is protected by an API Key guard. You need to set the key as an environment variable before running the backend.

**Create a `.env` file** inside the `backend/` folder:

```env
API_KEY=your_secret_key_here
PORT=3000
```

> ⚠️ **Never commit the `.env` file.** It is already included in `.gitignore`.

Then include the key in every request to the API:

```
GET http://localhost:3000/api/videos
Headers:
  x-api-key: your_secret_key_here
```

---

### 4. Run the Frontend (React + Vite)

Open a **new terminal**, navigate to the frontend folder and start the dev server:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at:
```
http://localhost:5173
```

> **Important:** Make sure the backend is running on port `3000` before opening the frontend. The React app fetches data from `http://localhost:3000/api/videos`.

---

## Environment Variables Reference

| Variable | Location | Description | Required |
|----------|----------|-------------|----------|
| `API_KEY` | `backend/.env` | Secret key to authenticate API requests | ✅ Yes |
| `PORT` | `backend/.env` | Port for the NestJS server (default: `3000`) | ❌ Optional |

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

## Security Notes

- The API key is validated via a NestJS Guard on every request.
- CORS is restricted to `http://localhost:5173` (the React dev server). Update this in `main.ts` before deploying to production.
- Rate limiting is recommended for production (see `@nestjs/throttler`).
- Store all secrets in `.env` files, never in source code.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `EADDRINUSE` on port 3000 | Another process is using the port. Run `lsof -i :3000` and kill it, or change `PORT` in `.env`. |
| CORS error in browser | Confirm the backend is running and that `enableCors` in `main.ts` matches your frontend URL. |
| `401 Unauthorized` on API call | Make sure the `x-api-key` header is set and matches the value in your `.env`. |
| Frontend shows "Error del servidor" | Check that the backend is running and the API key header is configured in `Cartelera.tsx`. |
