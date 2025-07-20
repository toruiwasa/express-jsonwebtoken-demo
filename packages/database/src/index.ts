import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "./env";

console.log(env.DATABASE_URL);
export const db = drizzle(env.DATABASE_URL);

export * from "./db/schema";

export {
  eq,
  ilike,
  or,
  count,
  desc,
  asc,
  and,
  not,
  isNull,
  isNotNull,
} from "drizzle-orm";
