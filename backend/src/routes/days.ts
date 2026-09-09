import { Router } from "express";
import { db } from "../db";
import { computeDailyStats } from "../stats/dailyStats";

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
