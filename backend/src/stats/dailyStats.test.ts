import { describe, expect, it } from "vitest";
import { computeDailyStats, type HourlyReading } from "./dailyStats";

function hour(
  date: string,
  hh: string,
  overrides: Partial<HourlyReading> = {},
): HourlyReading {
  return {
    date,
    starttime: `${date} ${hh}:00:00`,
    productionamount: 100,
    consumptionamount: 50,
    hourlyprice: 10,
    ...overrides,
  };
}

function fullDay(date: string, overrides: (h: number) => Partial<HourlyReading> = () => ({})) {
  return Array.from({ length: 24 }, (_, h) =>
    hour(date, String(h).padStart(2, "0"), overrides(h)),
  );
}

describe("computeDailyStats", () => {
  it("sums consumption/production and averages price for a full day", () => {
    const rows = fullDay("2024-01-01");

    const [day] = computeDailyStats(rows);

    expect(day.hoursRecorded).toBe(24);
    expect(day.isIncompleteDay).toBe(false);
    expect(day.totalConsumptionKwh).toBe(50 * 24);
    expect(day.totalProductionMwh).toBe(100 * 24);
    expect(day.averagePriceEurPerMwh).toBe(10);
  });

  it("reports null consumption when every reading that day is missing it", () => {
    const rows = fullDay("2024-01-01", () => ({ consumptionamount: null }));

    const [day] = computeDailyStats(rows);

    expect(day.totalConsumptionKwh).toBeNull();
    // Production/price are unaffected — the gap is specific to consumption.
    expect(day.totalProductionMwh).not.toBeNull();
    expect(day.averagePriceEurPerMwh).not.toBeNull();
  });

  it("reports null consumption when even a single hour that day is missing it", () => {
    const rows = fullDay("2024-01-01", (h) => (h === 12 ? { consumptionamount: null } : {}));

    const [day] = computeDailyStats(rows);

    expect(day.totalConsumptionKwh).toBeNull();
  });

  it("treats a day with fewer than 23 hours as incomplete and nulls out every metric", () => {
    const rows = fullDay("2024-01-01").slice(0, 10);

    const [day] = computeDailyStats(rows);

    expect(day.isIncompleteDay).toBe(true);
    expect(day.totalConsumptionKwh).toBeNull();
    expect(day.totalProductionMwh).toBeNull();
    expect(day.averagePriceEurPerMwh).toBeNull();
  });

  it("accepts a 23-hour day (DST spring-forward) as complete", () => {
    const rows = fullDay("2024-03-31").slice(0, 23);

    const [day] = computeDailyStats(rows);

    expect(day.isIncompleteDay).toBe(false);
    expect(day.totalProductionMwh).not.toBeNull();
  });

  it("finds the longest run of consecutive negative-price hours within a day", () => {
    const rows = fullDay("2024-01-01", (h) => ({
      // negative at hours 2,3,4 (len 3) and 10,11 (len 2) -> longest is 3
      hourlyprice: [2, 3, 4, 10, 11].includes(h) ? -5 : 5,
    }));

    const [day] = computeDailyStats(rows);

    expect(day.longestNegativePriceStreakHours).toBe(3);
  });

  it("does not count a null price as part of a negative streak", () => {
    const rows = fullDay("2024-01-01", (h) => {
      if (h === 2) return { hourlyprice: null };
      if ([1, 3].includes(h)) return { hourlyprice: -5 };
      return { hourlyprice: 5 };
    });

    const [day] = computeDailyStats(rows);

    // The null hour breaks the streak, so longest is 1, not 2.
    expect(day.longestNegativePriceStreakHours).toBe(1);
  });

  it("returns 0 (not null) when a day has no negative-price hours at all", () => {
    const rows = fullDay("2024-01-01");

    const [day] = computeDailyStats(rows);

    expect(day.longestNegativePriceStreakHours).toBe(0);
  });

  it("keeps the per-day streak scoped to that day (does not carry over from/to neighbouring days)", () => {
    const day1 = fullDay("2024-01-01", (h) => ({ hourlyprice: h === 23 ? -5 : 5 }));
    const day2 = fullDay("2024-01-02", (h) => ({ hourlyprice: h <= 2 ? -5 : 5 }));

    const [stats1, stats2] = computeDailyStats([...day1, ...day2]);

    // Day 1 only "owns" its single negative hour (23:00), not day 2's hours.
    expect(stats1.longestNegativePriceStreakHours).toBe(1);
    // Day 2 only "owns" its own 3-hour run (00:00-02:00).
    expect(stats2.longestNegativePriceStreakHours).toBe(3);
  });
});
