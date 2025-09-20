import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema",           // Directory with your product/table schemas
  out: "./src/types",               // Will generate a folder with types (not a TS file!)
  dialect: "postgresql",            // Correct value for Postgres (modern Drizzle)
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  }
} satisfies Config;
