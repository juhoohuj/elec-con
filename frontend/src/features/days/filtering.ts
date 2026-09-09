// Search/filter helpers.
//
// The problem: our cells show localized, formatted text ("9,50 €/MWh",
// "151 741 MWh", "ke 8.8.2023"), but MUI DataGrid's default search/filter
// compare against the *raw* field value (a plain number or an ISO date
// string). That mismatch is exactly why typing what you *see* doesn't find
// anything — "9,50" doesn't match the raw number 9.5's default toString
// ("9.5"), and "8.8.2023" doesn't match the raw date string "2023-08-08".
//
// Fix, in two parts:
//  - Quick filter (search box): always match against the same formatted
//    text the cell displays, for every column.
//  - Filter panel (per-column operators): for the date column, match
//    against the formatted text too (it's inherently a text search there).
//    For numeric columns, keep the real numeric operators (>, <, =, so
//    range filtering still works) but normalize Finnish input first
//    ("9,50" / "151 741" -> "9.50" / "151741") before parsing.

import { getGridNumericOperators, getGridStringOperators, type GridFilterOperator } from "@mui/x-data-grid";
import type { DayStats } from "./api";

export function quickFilterOnFormattedText(formatValue: (row: DayStats) => string) {
  return (searchValue: unknown) => {
    const needle = String(searchValue).toLowerCase();
    return (_value: unknown, row: DayStats) => formatValue(row).toLowerCase().includes(needle);
  };
}

function normalizeFiFiNumberInput(input: string): string {
  return input.replace(/\s/g, "").replace(",", ".");
}

/** Same numeric operators (=, >, <, ...) DataGrid uses by default, but tolerant of "9,50" / "151 741". */
export const fiFiNumericOperators: GridFilterOperator<DayStats>[] = getGridNumericOperators().map(
  (operator) => ({
    ...operator,
    getApplyFilterFn: (filterItem, column) => {
      const normalizedItem =
        typeof filterItem.value === "string"
          ? { ...filterItem, value: normalizeFiFiNumberInput(filterItem.value) }
          : filterItem;
      return operator.getApplyFilterFn(normalizedItem, column);
    },
  }),
);

/** String operators (contains, equals, ...) compared against formatted text instead of the raw value. */
export function displayTextOperators(formatValue: (row: DayStats) => string): GridFilterOperator<DayStats>[] {
  return getGridStringOperators().map((operator) => ({
    ...operator,
    getApplyFilterFn: (filterItem, column) => {
      const innerFn = operator.getApplyFilterFn(filterItem, column);
      if (!innerFn) return null;
      return (_value, row, col, apiRef) => innerFn(formatValue(row), row, col, apiRef);
    },
  }));
}
