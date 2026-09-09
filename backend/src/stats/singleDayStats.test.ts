import { describe, expect, it } from "vitest";
import { computeSingleDayStats } from "./singleDayStats";
import type { HourlyReading } from "./dailyStats";

function hour(hh: string, overrides: Partial<HourlyReading> = {}): HourlyReading {
  return {
    date: "2024-01-01",
    starttime: `2024-01-01 ${hh}:00:00`,
    productionamount: 100,
    consumptionamount: 50_000, // kWh, so 50 MWh — matches production's unit for these tests
    hourlyprice: 10,
    ...overrides,
  };
}

describe("computeSingleDayStats", () => {
  it("returns null for an empty day", () => {
    expect(computeSingleDayStats([])).toBeNull();
  });

  it("reuses the same daily totals as the list view", () => {
    const hours = Array.from({ length: 24 }, (_, h) => hour(String(h).padStart(2, "0")));
    const stats = computeSingleDayStats(hours);

    expect(stats?.totalProductionMwh).toBe(100 * 24);
    expect(stats?.isIncompleteDay).toBe(false);
  });

  it("finds the hour where consumption most exceeds production, in matching units", () => {
    const hours = Array.from({ length: 24 }, (_, h) =>
      hour(String(h).padStart(2, "0"), {
        productionamount: 100,
        // kWh; 100_000 kWh = 100 MWh, same as production, except hour 5 where
        // consumption is much higher relative to production.
        consumptionamount: h === 5 ? 300_000 : 100_000,
      }),
    );

    const stats = computeSingleDayStats(hours);

    expect(stats?.hourWithMostConsumptionVsProduction?.starttime).toBe("2024-01-01 05:00:00");
    expect(stats?.hourWithMostConsumptionVsProduction?.differenceMwh).toBe(200); // 300-100
  });

  it("ignores hours missing either value when comparing consumption to production", () => {
    const hours = [
      hour("00", { consumptionamount: null }),
      hour("01", { productionamount: null }),
    ];

    expect(computeSingleDayStats(hours)?.hourWithMostConsumptionVsProduction).toBeNull();
  });

  it("returns the 3 cheapest hours, sorted ascending, skipping null prices", () => {
    const hours = [
      hour("00", { hourlyprice: 5 }),
      hour("01", { hourlyprice: null }),
      hour("02", { hourlyprice: -2 }),
      hour("03", { hourlyprice: 1 }),
      hour("04", { hourlyprice: 9 }),
    ];

    const cheapest = computeSingleDayStats(hours)?.cheapestHours;

    expect(cheapest).toEqual([
      { starttime: "2024-01-01 02:00:00", hourlyprice: -2 },
      { starttime: "2024-01-01 03:00:00", hourlyprice: 1 },
      { starttime: "2024-01-01 00:00:00", hourlyprice: 5 },
    ]);
  });
});
