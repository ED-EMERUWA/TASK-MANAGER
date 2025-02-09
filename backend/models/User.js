import { Model, DataTypes } from 'sequelize'; // Import Model and DataTypes
import sequelize from "../configs/database.config.js"; // IMport creted seqeulize instance  
import Role from './Role.js';

class User extends Model {} // Making a User class that extends seqeulize's model

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            field: 'id'  // explicitly naming the field
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.INTEGER,
            references: {
                model: Role,
                key: 'id',
            },
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        sequelize,
        tableName: 'User',
        timestamps: false,
    }
)

// Export the Program model for use in other parts of the application
export default User;