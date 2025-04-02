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