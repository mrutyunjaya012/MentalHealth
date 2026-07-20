import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Prefer server/public (copied at build time); fall back to client/dist for local prod tests
const candidateStaticPaths = [
  path.resolve(__dirname, "../public"),
  path.resolve(__dirname, "../../client/dist"),
];
const clientDistPath = candidateStaticPaths.find((p) =>
  fs.existsSync(path.join(p, "index.html"))
);

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());
const isDev = process.env.NODE_ENV !== "production";

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (isDev && /^http:\/\/localhost(:\d+)?$/.test(origin)) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    staticPath: clientDistPath || null,
  });
});

app.use("/api/users", userRoutes);
app.use("/api/predictions", predictionRoutes);

if (!isDev) {
  if (!clientDistPath) {
    console.error(
      "Static frontend not found. Looked in:",
      candidateStaticPaths.join(", ")
    );
  } else {
    console.log(`Serving frontend from: ${clientDistPath}`);
    app.use(express.static(clientDistPath, { index: false }));

    app.get(/^(?!\/api).*/, (req, res, next) => {
      // Let missing asset requests 404 instead of returning index.html
      if (path.extname(req.path)) {
        res.status(404).end();
        return;
      }

      res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
        if (err) next(err);
      });
    });
  }
}

app.use("/api", notFound);
app.use(errorHandler);

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
