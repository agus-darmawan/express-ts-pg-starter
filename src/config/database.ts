import { Sequelize } from "sequelize";
import { Client } from "pg";
import dotenv from "dotenv";
import logger from "./logger";
dotenv.config();

const dbName = process.env.DB_NAME || "bookstore";
const dbUser = process.env.DB_USER || "postgres";
const dbPassword = process.env.DB_PASSWORD || "";
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = process.env.DB_PORT || 5432;

// ENSURE THE DB EXISTS
const ensureDatabaseExists = async () => {
  const client = new Client({
    user: dbUser,
    host: dbHost,
    database: "postgres",
    password: dbPassword,
    port: Number(dbPort),
  });

  try {
    await client.connect();
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${dbName}'`
    );
    if (res.rowCount === 0) {
      logger.info(`Database ${dbName} does not exist. Creating...`);
      await client.query(`CREATE DATABASE ${dbName}`);
      logger.info(`Database ${dbName} created successfully.`);
    } else {
      logger.info(`Database ${dbName} already exists.`);
    }
  } catch (error) {
    logger.error("Error ensuring database exists:", error);
  } finally {
    await client.end();
  }
};

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: Number(dbPort),
  dialect: "postgres",
  logging: false,
});

export const syncDatabase = async () => {
  await ensureDatabaseExists();
  try {
    await sequelize.authenticate();
    logger.info(
      "Connection to the database has been established successfully."
    );
    await sequelize.sync({ force: false });
    logger.info("Database synchronized successfully.");
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    throw error;
  }
};

export default sequelize;
