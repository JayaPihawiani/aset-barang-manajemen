import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Penghapusan = db.define(
  "penghapusan",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    tgl_hapus: DataTypes.DATE,
  },
  { freezeTableName: true }
);

export default Penghapusan;
