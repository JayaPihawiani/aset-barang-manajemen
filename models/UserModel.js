import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import ReqBarang from "./RequestModel.js";

const User = db.define(
  "user",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING(200),
    refresh_token: DataTypes.STRING,
  },
  { freezeTableName: true }
);

User.hasMany(ReqBarang, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

ReqBarang.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

export default User;
