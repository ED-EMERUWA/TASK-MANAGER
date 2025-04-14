import { Model, DataTypes } from "sequelize"; // Import Model and DataTypes
import sequelize from "../configs/database.config.js"; // Import created Sequelize instance

class Org extends Model {}

Org.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "Org",
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{ name: "id" }],
      },
    ],
  }
);

export default Org;
