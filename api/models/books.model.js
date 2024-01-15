import { DataTypes } from "sequelize";
import { sequelize } from "../config.js";

const Book = sequelize.define("Book", {});

Book.init(
  {
    /* ... other attributes ... */
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isbn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    available_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    shelf_location: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Book",
    tableName: "Book",
    indexes: [
      {
        name: "idx_title",
        fields: ["title"],
      },
      { name: "idx_author", fields: ["author"] },
      { name: "idx_isbn", fields: ["isbn"], type: "UNIQUE" },
    ],
  }
);

export { Book };
