import { Model, DataTypes } from "sequelize"; // Import Model and DataTypes
import sequelize from "../configs/database.config.js"; // IMport creted seqeulize instance
class Role extends Model {}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true, // Recommended for primary keys
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Role", // Add this to avoid issues with model references
    tableName: "Role",
    timestamps: false,
  }
);

export default Role