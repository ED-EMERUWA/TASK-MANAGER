import sequelize from "../configs/database.config.js";
import {Model, DataTypes} from 'sequelize';
import User from "./User.js";

class Task extends  Model {};

Task.init({
    id:{
        type : DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    Body:
    {
        type: DataTypes.STRING,
        allowNull: true,

    },
    Topic:{
        type: DataTypes.STRING,
        allowNull: false
    },
    Assignee:{
        type : DataTypes.INTEGER,
        references:{
            model: User,
            key : 'id'
        }
    },
    Assignedto:{
        type: DataTypes.INTEGER,
        references:{
            model:User,
            key:'id'
        }
    }

},
{
  sequelize,
  tableName: 'Task', // Specify the exact table name
  timestamps: false, // Disable timestamps if not needed
})

// Export the Program model for use in other parts of the application
export default Task;