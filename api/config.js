// config.js
import { Sequelize } from "sequelize";
import { db_env } from "./db_env.js";

console.log(db_env[process.env.NODE_ENV]);

const sequelize = new Sequelize(db_env[process.env.NODE_ENV].url, {
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

sequelize.sync();

export { sequelize };
