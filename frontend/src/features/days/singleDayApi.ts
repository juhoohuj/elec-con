const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

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
  differenceMwh: number;
}

// Mirrors backend/src/stats/singleDayStats.ts SingleDayStats.
export interface SingleDayStats {
  date: string;
  hoursRecorded: number;
  isIncompleteDay: boolean;
  totalConsumptionKwh: number | null;
  totalProductionMwh: number | null;
  averagePriceEurPerMwh: number | null;
  longestNegativePriceStreakHours: number;
  hours: HourStat[];
  hourWithMostConsumptionVsProduction: ComparisonHour | null;
  cheapestHours: { starttime: string; hourlyprice: number }[];
}

export async function fetchSingleDayStats(date: string): Promise<SingleDayStats> {
  const response = await fetch(`${API_URL}/api/days/${date}`);
  if (!response.ok) {
    throw new Error(`Päivän tietojen haku epäonnistui (${response.status})`);
  }
  return response.json();
}
