import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export const db_env = {
  production: {
    username: process.env.PRODUCTION_USERNAME,
    password: process.env.PRODUCTION_PASSWORD,
    database: process.env.PRODUCTION_DATABASE,
    host: process.env.PRODUCTION_HOST,
    dialect: process.env.PRODUCTION_DIALECT, // You can use 'mysql', 'postgres', 'sqlite', or 'mssql'
    logging: process.env.PRODUCTION_LOGGING, // Set to true if you want to log SQL queries
    url: process.env.PRODUCTION_DB_URL,
  },
  development: {
    username: process.env.DEVELOPMENT_USERNAME,
    password: process.env.DEVELOPMENT_PASSWORD,
    database: process.env.DEVELOPMENT_DATABASE,
    host: process.env.DEVELOPMENT_HOST,
    dialect: process.env.DEVELOPMENT_DIALECT, // You can use 'mysql', 'postgres', 'sqlite', or 'mssql'
    logging: process.env.DEVELOPMENT_LOGGING, // Set to true if you want to log SQL queries
    url: process.env.DEVELOPMENT_DB_URL,
  },
  test: {
    username: process.env.TEST_USERNAME,
    password: process.env.TEST_PASSWORD,
    database: process.env.TEST_DATABASE,
    host: process.env.TEST_HOST,
    dialect: process.env.TEST_DIALECT,
    logging: process.env.TEST_LOGGING,
    url: process.env.TEST_DB_URL,
  },
};
