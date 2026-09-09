// Formats dates and numbers for display

// Date is a plain "YYYY-MM-DD" string (see backend/src/db/index.ts for why timestamps are never parsed into JS Date objects)

//Why we do it here because we want to display the date in the local timezone and not the UTC timezone

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("fi-FI", {
    weekday: "short",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  }).format(date);
}

// starttime is "YYYY-MM-DD HH:MM:SS" — sliced directly rather than parsed
// into a Date, same reasoning as formatDate above.
export function formatHour(starttime: string): string {
  return starttime.slice(11, 16);
}

const numberFormat = new Intl.NumberFormat("fi-FI", { maximumFractionDigits: 0 });
const priceFormat = new Intl.NumberFormat("fi-FI", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEnergy(value: number | null, unit: string): string {
  if (value === null) return "";
  return `${numberFormat.format(value)} ${unit}`;
}

export function formatPrice(value: number | null): string {
  if (value === null) return "";
  return `${priceFormat.format(value)} €/MWh`;
}
