import express from "express";
import http from "http";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { initSocket } from "./backend-main/chat/socket.js";
import { datastore } from "./backend-main/models/datastore.js";

// Routers
import repoRouter from "./backend-main/routes/repo.router.js";
import analyticsRouter from "./backend-main/routes/analytics.router.js";
import leaderboardRouter from "./backend-main/routes/leaderboard.router.js";
import aiRouter from "./backend-main/routes/ai.router.js";
import chatRouter from "./backend-main/routes/chat.router.js";
import userRouter from "./backend-main/routes/user.router.js";

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  // Initialize socket.io interface
  initSocket(server);

  app.use(cors());
  app.use(express.json());

  // API Route mount placements
  app.use("/api/repos", repoRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/leaderboard", leaderboardRouter);
  app.use("/api/ai", aiRouter);
  app.use("/api/chat", chatRouter);
  app.use("/api/users", userRouter);

  // Notifications Endpoints
  app.get("/api/notifications", (req, res) => {
    try {
      res.json(datastore.getNotifications());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/notifications/read", (req, res) => {
    try {
      datastore.markNotificationsAsRead();
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Client-Facing HTML / SPA asset compiler
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`RepoMind AI Server active at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Fatal startup crash error:", err);
});
