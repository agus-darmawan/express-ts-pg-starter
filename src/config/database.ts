import { Sequelize } from "sequelize";
import { Client } from "pg";
import dotenv from "dotenv";
import config from "./config";
import logger from "./logger";

dotenv.config();

const environment = (process.env.NODE_ENV ||
  "development") as keyof typeof config;
const dbConfig = config[environment];
const { username, password, database, host, port } = dbConfig;

const ensureDatabaseExists = async () => {
  const client = new Client({
    user: username,
    host: host,
    database: "postgres",
    password: password,
    port: port,
  });

  try {
    await client.connect();
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = '${database}'`
    );
    if (res.rowCount === 0) {
      logger.info(`Database ${database} does not exist. Creating...`);
      await client.query(`CREATE DATABASE ${database}`);
      logger.info(`Database ${database} created successfully.`);
    } else {
      logger.info(`Database ${database} already exists.`);
    }
  } catch (error) {
    logger.error("Error ensuring database exists:", error);
  } finally {
    await client.end();
  }
};

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
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
