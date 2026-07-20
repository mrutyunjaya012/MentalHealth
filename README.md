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
| `npm run build` | Build client for production |
| `npm run start` | Start production server |
| `npm run seed` | Seed MongoDB with sample data |
| `npm run lint` | Lint the client |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| * | `/api/users` | User auth & management |
| * | `/api/predictions` | Prediction CRUD |

## Production

1. Build the client: `npm run build`
2. Serve `client/dist` via your host, or configure Express static serving
3. Set `VITE_API_URL` to your deployed API URL before building
4. Set `NODE_ENV=production` and `CLIENT_URL` on the server
