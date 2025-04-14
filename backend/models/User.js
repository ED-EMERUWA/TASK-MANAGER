<<<<<<< HEAD
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
=======
import { Model, DataTypes } from "sequelize";
import sequelize from "../configs/database.config.js";

class User extends Model {}

User.init(
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true, // Make email unique
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Role',
        key: 'id',
      },
    },
    org_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Org',
        key: 'id',
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'User',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: ["id"],
      },
      {
        name: "role_idx",
        using: "BTREE",
        fields: ["role"],
      },
      {
        name: "org_idx",
        using: "BTREE",
        fields: ["org_id"],
      },
      {
        name: "email_unique_idx", // Optional named index for uniqueness
        unique: true,
        using: "BTREE",
        fields: ["email"],
      },
    ],
  }
);

export default User;
>>>>>>> master
