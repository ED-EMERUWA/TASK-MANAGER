import { Model, DataTypes } from "sequelize"; // Import Model and DataTypes
import sequelize from "../configs/database.config.js"; // Import created Sequelize instance

class RolePermission extends Model {}

RolePermission.init(
  {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Role',
        key: 'id',
      },
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Permission',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'RolePermission',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "role_id" },
          { name: "permission_id" },
        ],
      },
      {
        name: "permission_id_idx",
        using: "BTREE",
        fields: [{ name: "permission_id" }],
      },
    ],
  }
);

export default RolePermission;
