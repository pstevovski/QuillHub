import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// Establish a connection pool to the MySQL database
const connectionPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Connect DrizzleORM to the MySQL database
const db = drizzle(connectionPool);

export default db;
