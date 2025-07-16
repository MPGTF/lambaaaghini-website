import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { twitterRouter } from "./routes/twitter";
import { tweetLaunchRouter } from "./routes/tweetLaunch";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Twitter API routes
  app.use("/api/twitter", twitterRouter);

  // Tweet-to-launch routes
  app.use("/api/tweet-launch", tweetLaunchRouter);

  return app;
}
