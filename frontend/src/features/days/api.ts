const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

// Mirrors backend/src/stats/dailyStats.ts DayStats.
export interface DayStats {
  date: string;
  hoursRecorded: number;
  isIncompleteDay: boolean;
  totalConsumptionKwh: number | null;
  totalProductionMwh: number | null;
  averagePriceEurPerMwh: number | null;
  longestNegativePriceStreakHours: number;
}

export async function fetchDailyStats(): Promise<DayStats[]> {
  const response = await fetch(`${API_URL}/api/days`);
  if (!response.ok) {
    throw new Error(`Päivätilastojen haku epäonnistui (${response.status})`);
  }
  return response.json();
}
