import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/*",
  out: "./src/db/migrations",
  driver: "mysql2",
  dbCredentials: {
    host: process.env.DB_HOST!,
    user: process.env.DB_USER,
    database: process.env.DB_NAME!,
    password: process.env.DB_PASSWORD,
  },
} satisfies Config;
