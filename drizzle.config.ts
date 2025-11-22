import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not set. Drizzle migrations will not work.");
  console.warn("💡 Set DATABASE_URL to use drizzle-kit commands.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://localhost:5432/dummy",
  },
});
