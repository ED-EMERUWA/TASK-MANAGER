<<<<<<< HEAD
import { Model, DataTypes } from 'sequelize'; // Import Model and DataTypes
import sequelize from "../configs/database.config.js"; // IMport creted seqeulize instance  


class Permission extends Model {}

Permission.init({
    id : {
        type : DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    name : {
        type : DataTypes.STRING,
        allowNull: false
    }
},
{
  sequelize,
  tableName: 'Permission', // Specify the exact table name
  timestamps: false, // Disable timestamps if not needed
})

// Export the Program model for use in other parts of the application
export default Permission;
=======
import { Model, DataTypes } from "sequelize"; // Import Model and DataTypes
import sequelize from "../configs/database.config.js"; // Import created Sequelize instance

class Permission extends Model {}

Permission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'Permission',
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

export default Permission;
>>>>>>> master
