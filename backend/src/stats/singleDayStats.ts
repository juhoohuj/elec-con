// Computes the extra stats needed for the single-day view, on top of the
// same daily totals used by the list (computeDailyStats).

import { computeDailyStats, type DayStats, type HourlyReading } from "./dailyStats";

export interface HourStat {
  starttime: string;
  productionamount: number | null;
  consumptionamount: number | null;
  hourlyprice: number | null;
}

export interface ComparisonHour {
  starttime: string;
  consumptionMwh: number;
  productionMwh: number;
  differenceMwh: number; // consumption - production, both converted to MWh
}

export interface SingleDayStats extends DayStats {
  hours: HourStat[];
  hourWithMostConsumptionVsProduction: ComparisonHour | null;
  cheapestHours: { starttime: string; hourlyprice: number }[];
}

const CHEAPEST_HOURS_COUNT = 3;

/** `hours` must all belong to the same calendar day. Returns null if empty. */
export function computeSingleDayStats(hours: readonly HourlyReading[]): SingleDayStats | null {
  if (hours.length === 0) return null;

  const [dayTotals] = computeDailyStats(hours);

  return {
    ...dayTotals,
    hours: hours.map((h) => ({
      starttime: h.starttime,
      productionamount: h.productionamount,
      consumptionamount: h.consumptionamount,
      hourlyprice: h.hourlyprice,
    })),
    hourWithMostConsumptionVsProduction: findHourWithMostConsumptionVsProduction(hours),
    cheapestHours: findCheapestHours(hours),
  };
}

// consumptionamount is stored in kWh, productionamount in MWh — converted to
// a common unit (MWh) here so "most consumption compared to production"
// means something (an hour is only considered if both values are present).
function findHourWithMostConsumptionVsProduction(
  hours: readonly HourlyReading[],
): ComparisonHour | null {
  let best: ComparisonHour | null = null;

  for (const h of hours) {
    if (h.consumptionamount === null || h.productionamount === null) continue;

    const consumptionMwh = h.consumptionamount / 1000;
    const productionMwh = h.productionamount;
    const differenceMwh = consumptionMwh - productionMwh;

    if (best === null || differenceMwh > best.differenceMwh) {
      best = { starttime: h.starttime, consumptionMwh, productionMwh, differenceMwh };
    }
  }

  return best;
}

function findCheapestHours(
  hours: readonly HourlyReading[],
): { starttime: string; hourlyprice: number }[] {
  return hours
    .filter((h): h is HourlyReading & { hourlyprice: number } => h.hourlyprice !== null)
    .map((h) => ({ starttime: h.starttime, hourlyprice: h.hourlyprice }))
    .sort((a, b) => a.hourlyprice - b.hourlyprice)
    .slice(0, CHEAPEST_HOURS_COUNT);
}
