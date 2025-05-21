import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.config.js";

class CompletionCriteria extends Model {}

CompletionCriteria.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    task_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    criteria_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_met: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'CompletionCriteria',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id" }],
      },
      {
        name: "task_id_idx",
        using: "BTREE",
        fields: [{ name: "task_id" }],
      },
    ],
  }
);

export default CompletionCriteria;
