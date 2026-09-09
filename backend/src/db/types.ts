import type { Generated } from "kysely";

// ElectricityData table schema as it exists in Postgres
export interface ElectricityDataTable {
  id: Generated<number>;
  date: string;
  starttime: string;
  productionamount: number | null;
  consumptionamount: number | null;
  hourlyprice: number | null;
}

export interface Database {
  electricitydata: ElectricityDataTable;
}
