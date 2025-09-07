import { defineConfig } from "drizzle-kit";

// Database config only needed for migrations (not used in memory storage mode)
export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://localhost:5432/temp",
  },
});
