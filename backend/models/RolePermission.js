import sequelize from "../configs/database.config.js";
import { Model, DataTypes } from "sequelize";
import Permission from "./Permission.js";
import Role from "./Role.js";

class RolePermission extends Model {}

RolePermission.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Permission, // Reference the actual model
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "RolePermission",
    tableName: "RolePermission",
    timestamps: false,
  }
);

export default RolePermission;
