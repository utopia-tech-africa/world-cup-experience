import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({
  connectionString,
  // Avoid "Connection closed unexpectedly" – default idleTimeoutMillis is 10s
  idleTimeoutMillis: 300_000, // 5 minutes
  connectionTimeoutMillis: 10_000,
});
export const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});
