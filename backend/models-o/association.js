import Role from "./Role.js";
import RolePermission from "./RolePermission.js";
import User from "./User.js";
import Permission from "./Permission.js";
import Task from './Task.js';
import Org from './Org.js';

// Set up associations

// User-Role associations
Role.hasMany(User, { 
  foreignKey: 'role',
  as: 'Users'
});

User.belongsTo(Org, {
  foreignKey: 'org_id',
  as: 'Organization'
});

User.belongsTo(Role, { 
  foreignKey: 'role',
  as: 'Role'
});

// User-Task associations
User.hasMany(Task, { 
  foreignKey: 'Assignee', 
  as: 'AssignedTasks' 
});

User.hasMany(Task, { 
  foreignKey: 'AssignedTo', 
  as: 'TasksAssignedTo' 
});

Task.belongsTo(User, { 
  foreignKey: 'Assignee', 
  as: 'AssigneeDetails' 
});

Task.belongsTo(User, { 
  foreignKey: 'AssignedTo', 
  as: 'AssignedToDetails' 
});

// Role-Permission many-to-many relationship
Role.belongsToMany(Permission, { 
  through: RolePermission,
  foreignKey: 'role_id',
  otherKey: 'permission_id',
  as: 'Permissions'
});

Permission.belongsToMany(Role, { 
  through: RolePermission,
  foreignKey: 'permission_id',
  otherKey: 'role_id',
  as: 'Roles'
});

// RolePermission associations with Role and Permission
RolePermission.belongsTo(Permission, {
  foreignKey: 'permission_id',
  as: 'Permission'
});

Permission.hasMany(RolePermission, {
  foreignKey: 'permission_id',
  as: 'RolePermissions'
});

RolePermission.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'Role'
});

Role.hasMany(RolePermission, {
  foreignKey: 'role_id',
  as: 'RolePermissions'
});

// Define the association between Org and User (one-to-many relationship)
Org.hasMany(User, {
  foreignKey: 'org_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'Users'
});

// Define the association between Org and Task (one-to-many relationship)
Org.hasMany(Task, {
  foreignKey: 'org_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'Tasks'
});

// Org-Task associations
Task.belongsTo(Org, {
  foreignKey: 'org_id',
  as: 'Organization'
});


export default {
  Permission,
  RolePermission,
  User,
  Task,
  Role,
  Org
}

// redo databse: set DB_HOST=127.0.0.1 && set DB_NAME=user_management_db && set DB_USER=ultimated && set DB_USER_PASSWORD=Kene0 && set DB_PORT=2000 && ^
// npx sequelize-auto -o "./models1" ^
// -d %DB_NAME% -h %DB_HOST% -u %DB_USER% -x %DB_USER_PASSWORD% -p %DB_PORT% ^
// --dialect mysql --caseModel camel --caseFile camel --lang esm
