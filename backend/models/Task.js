import { Model, DataTypes } from "sequelize"; // Import Model and DataTypes
import sequelize from "../configs/database.config.js"; // Import created Sequelize instance

class Task extends Model {}

Task.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    Body: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    Assignee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    AssignedTo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id',
      },
    },
    Topic: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    AssignedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    DueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    CompletedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    completedNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    org_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Org',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'Task',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id" }],
      },
      {
        name: "Assignee_idx",
        using: "BTREE",
        fields: [{ name: "Assignee" }],
      },
      {
        name: "AssignedTo_idx",
        using: "BTREE",
        fields: [{ name: "AssignedTo" }],
      },
      {
        name: "org_id_idx",
        using: "BTREE",
        fields: [{ name: "org_id" }],
      },
    ],
  }
);

export default Task;
