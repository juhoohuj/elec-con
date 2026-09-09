import { Pool, types } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { config } from "../config";
import type { Database } from "./types";


// Parse NUMERIC columns as numbers to avoid losing precision on very large numbers
const PG_TYPE_NUMERIC = 1700;
types.setTypeParser(PG_TYPE_NUMERIC, (value) => (value === null ? null : parseFloat(value)));


// Parse DATE and TIMESTAMP columns as strings to avoid losing timezone information
const PG_TYPE_DATE = 1082;
const PG_TYPE_TIMESTAMP = 1114;
types.setTypeParser(PG_TYPE_DATE, (value) => value);
types.setTypeParser(PG_TYPE_TIMESTAMP, (value) => value);


// Parse BIGINT columns as numbers to avoid losing precision on very large numbers
const PG_TYPE_BIGINT = 20;
types.setTypeParser(PG_TYPE_BIGINT, (value) => parseInt(value, 10));

const pool = new Pool({ connectionString: config.databaseUrl });

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool }),
});
