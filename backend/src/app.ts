import express from "express";
import cors from "cors";
import { daysRouter } from "./routes/days";

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/days", daysRouter);

  return app;
}
