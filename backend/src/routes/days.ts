import { Router } from "express";
import { db } from "../db";
import { computeDailyStats } from "../stats/dailyStats";
import { computeSingleDayStats } from "../stats/singleDayStats";

export const daysRouter = Router();

daysRouter.get("/", async (_req, res, next) => {
  try {
    const rows = await db
      .selectFrom("electricitydata")
      .select(["date", "starttime", "productionamount", "consumptionamount", "hourlyprice"])
      .orderBy("date", "asc")
      .orderBy("starttime", "asc")
      .execute();

    res.json(computeDailyStats(rows));
  } catch (err) {
    next(err);
  }
});

daysRouter.get("/:date", async (req, res, next) => {
  try {
    const rows = await db
      .selectFrom("electricitydata")
      .select(["date", "starttime", "productionamount", "consumptionamount", "hourlyprice"])
      .where("date", "=", req.params.date)
      .orderBy("starttime", "asc")
      .execute();

    const stats = computeSingleDayStats(rows);
    if (!stats) {
      res.status(404).json({ error: "Day not found" });
      return;
    }
    res.json(stats);
  } catch (err) {
    next(err);
  }
});
