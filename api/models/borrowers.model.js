// models/borrowers.model.js

import { DataTypes } from "sequelize";
import { sequelize } from "../config.js";

const Borrower = sequelize.define("Borrower", {});

Borrower.init(
  {
    /* ... other attributes ... */
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,

      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Borrower",
    tableName: "Borrower",
    indexes: [
      {
        name: "idx_email", // Optional, you can give a custom name to the index
        fields: ["email"],
      },
    ],
  }
);

export { Borrower };
