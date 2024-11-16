import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Penghapusan from "./PenghapusanM.js";
import ReqBarang from "./RequestModel.js";

const Barang = db.define(
  "barang",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    qty: DataTypes.INTEGER,
  },
  { freezeTableName: true }
);

Barang.hasOne(Penghapusan, {
  foreignKey: "barang_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Penghapusan.belongsTo(Barang, {
  foreignKey: "barang_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Barang.hasMany(ReqBarang, {
  foreignKey: "barang_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

ReqBarang.belongsTo(Barang, {
  foreignKey: "barang_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default Barang;
