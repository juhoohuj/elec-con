// Computes daily statistics from hourly readings

export interface HourlyReading {
  date: string;
  starttime: string;
  productionamount: number | null;
  consumptionamount: number | null;
  hourlyprice: number | null;
}

export interface DayStats {
  date: string;
  hoursRecorded: number;
  isIncompleteDay: boolean;
  totalConsumptionKwh: number | null;
  totalProductionMwh: number | null;
  averagePriceEurPerMwh: number | null;
  longestNegativePriceStreakHours: number;
}

const MIN_HOURS_FOR_COMPLETE_DAY = 23;

// Rows must already be sorted by (date, starttime) ascending.
export function computeDailyStats(rows: readonly HourlyReading[]): DayStats[] {
  const days = groupConsecutiveByDate(rows);

  return days.map(({ date, hours }) => {
    const isIncomplete = hours.length < MIN_HOURS_FOR_COMPLETE_DAY;

    const totalConsumptionKwh = isIncomplete
      ? null
      : sumOrNullIfAnyMissing(hours.map((h) => h.consumptionamount));
    const totalProductionMwh = isIncomplete
      ? null
      : sumOrNullIfAnyMissing(hours.map((h) => h.productionamount));
    const averagePriceEurPerMwh = isIncomplete
      ? null
      : averageOrNullIfAnyMissing(hours.map((h) => h.hourlyprice));

    return {
      date,
      hoursRecorded: hours.length,
      isIncompleteDay: isIncomplete,
      totalConsumptionKwh,
      totalProductionMwh,
      averagePriceEurPerMwh,
      longestNegativePriceStreakHours: longestConsecutiveNegativePriceRun(hours),
    };
  });
}

function groupConsecutiveByDate(
  rows: readonly HourlyReading[],
): { date: string; hours: HourlyReading[] }[] {
  const groups: { date: string; hours: HourlyReading[] }[] = [];

  for (const row of rows) {
    const currentGroup = groups.at(-1);
    if (currentGroup && currentGroup.date === row.date) {
      currentGroup.hours.push(row);
    } else {
      groups.push({ date: row.date, hours: [row] });
    }
  }

  return groups;
}

function longestConsecutiveNegativePriceRun(hours: readonly HourlyReading[]): number {
  let longest = 0;
  let current = 0;

  for (const hour of hours) {
    if (isNegative(hour.hourlyprice)) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
}

function isNegative(price: number | null | undefined): boolean {
  return price !== null && price !== undefined && price < 0;
}

function sumOrNullIfAnyMissing(values: readonly (number | null)[]): number | null {
  if (values.some((v) => v === null)) return null;
  return (values as number[]).reduce((total, v) => total + v, 0);
}

function averageOrNullIfAnyMissing(values: readonly (number | null)[]): number | null {
  const total = sumOrNullIfAnyMissing(values);
  return total === null ? null : total / values.length;
}
