import "dotenv/config";

import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import mysql from "mysql2";

// Establish a single connection to the MySQL database
const migrateConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
});
const dbMigrateConnection = drizzle(migrateConnection);

// Trigger the Drizzle Kit database schema migration process
// This is called by running the `npm run migration:run` command
async function migration() {
  try {
    console.log("Migration Started...");
    await migrate(dbMigrateConnection, {
      migrationsFolder: "./src/db/migrations",
    });
    console.log("Migration completed!");
    process.exit(0);
  } catch (err: any) {
    console.log("Error: ", err.message);
    process.exit(1);
  } finally {
    migrateConnection.end();
  }
}

migration();
