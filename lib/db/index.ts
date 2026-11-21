import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

const globalForDatabase = globalThis as typeof globalThis & {
  procurementPool?: Pool
}

const pool = globalForDatabase.procurementPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
})

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.procurementPool = pool
}

export const db = drizzle(pool, { schema })
