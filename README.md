# NeuroPredict — Mental Health Prediction (MERN)

AI-powered mental health prediction app for youth. Built with the **MERN** stack:

| Layer | Tech |
|-------|------|
| **M**ongoDB | Atlas (Mongoose) |
| **E**xpress | Node.js API in `server/` |
| **R**eact | Vite + Tailwind in `client/` |
| **N**ode | Express backend |

```
Mental-Health/
├── client/          # React frontend (Vite)
│   └── src/
├── server/          # Express + MongoDB API
│   └── src/
├── package.json     # Root scripts (run both apps)
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

## Setup

### 1. Install dependencies

```bash
npm run install:all
```

Or separately:

```bash
npm install --prefix client
npm install --prefix server
```

### 2. Configure environment

**Server** — copy and edit `server/.env`:

```bash
cp server/.env.example server/.env
```

Set your MongoDB URI:

```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/MentalHealth
PORT=5001
CLIENT_URL=http://localhost:5173
```

**Client** — optional (`client/.env`):

```bash
cp client/.env.example client/.env
```

```
VITE_API_URL=/api
```

In development, Vite proxies `/api` to `http://localhost:5001`.

### 3. Seed the database (optional)

```bash
npm run seed
```

### 4. Run the app

**Both client + server:**

```bash
npm run dev
```

**Or separately** (two terminals):

```bash
npm run dev:server   # http://localhost:5001
npm run dev:client   # http://localhost:5173
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run install:all` | Install client + server deps |
| `npm run dev` | Start client and server |
| `npm run dev:client` | Vite frontend only |
| `npm run dev:server` | Express API only |
| `npm run build` | Install deps + build client (Render-ready) |
| `npm run start` | Start production Express (serves API + SPA) |
| `npm run seed` | Seed MongoDB with sample data |
| `npm run lint` | Lint the client |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| * | `/api/users` | User auth & management |
| * | `/api/predictions` | Prediction CRUD |

## Deploy on Render (single service)

Express serves the API and the built React app from one URL. Axios uses `/api` (same origin).

### 1. Push to GitHub

Commit and push this repo to GitHub.

### 2. Allow Atlas access from Render

In [MongoDB Atlas](https://cloud.mongodb.com/) → **Network Access** → add IP `0.0.0.0/0` (allow access from anywhere). Render uses dynamic IPs.

### 3. Create the Web Service

**Option A — Blueprint**

1. Go to [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**
2. Connect this repo (uses [`render.yaml`](render.yaml))
3. Set secret env vars when prompted:
   - `MONGODB_URI` — your Atlas connection string
   - `CLIENT_URL` — your service URL after it exists (e.g. `https://neuropredict.onrender.com`); you can update this after the first deploy

**Option B — Manual Web Service**

1. **New** → **Web Service** → connect the repo
2. Settings:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
3. Environment variables:

| Key | Value |
|-----|--------|
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Atlas connection string |
| `CLIENT_URL` | `https://<your-service>.onrender.com` |

Do **not** commit `server/.env`. Secrets live only in Render.

### 4. Seed data (optional)

After the first successful deploy, open **Shell** on the service and run:

```bash
npm run seed --prefix server
```

Default accounts: `admin@gmail.com` / `admin123`, `user@gmail.com` / `user123`.

### Notes

- Free Render services sleep when idle; the first request after sleep can take 30–60 seconds.
- Local development is unchanged: `npm run dev` (Vite + API on separate ports).
