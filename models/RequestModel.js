import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const ReqBarang = db.define(
  "req_barang",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
    },
  },
  { freezeTableName: true }
);

export default ReqBarang;
