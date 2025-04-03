import { Sequelize } from "sequelize";

const sequelizeConnection = new Sequelize({
  dialect: "sqlite",
  storage: "./db/sqlite.db",
  logging: false,
});

export { sequelizeConnection };
