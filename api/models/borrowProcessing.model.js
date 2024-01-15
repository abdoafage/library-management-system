import { DataTypes, NOW, Sequelize } from "sequelize";
import { sequelize } from "../config.js";
import { Book } from "./books.model.js";
import { Borrower } from "./borrowers.model.js";

const BorrowProcessing = sequelize.define("BorrowProcessing", {});

BorrowProcessing.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // The time when the book checked out.
    checkout_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: NOW(),
    },
    // The deadline time that the book must returned.
    due_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // The time when the book returned
    return_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // status of returning true or false.
    return_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  { sequelize, modelName: "BorrowProcessing", tableName: "BorrowProcessing" }
);

Book.hasMany(BorrowProcessing, {
  foreignKey: "book_id",
  sourceKey: "id",
});
BorrowProcessing.belongsTo(Book, { foreignKey: "book_id" });

Borrower.hasMany(BorrowProcessing, {
  foreignKey: "borrower_id",
  sourceKey: "id",
});
BorrowProcessing.belongsTo(Borrower, { foreignKey: "borrower_id" });

export { BorrowProcessing };
