    

import Role from "./Role.js";
import RolePermission from "./RolePermission.js";
import User from "./User.js";
import Permission from "./Permission.js";
import Task from './Task.js'
// Set up associations
// User-Role associations
Role.hasMany(User, { 
  foreignKey: 'role'
});

User.belongsTo(Role, { 
  foreignKey: 'role'
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
  otherKey: 'permission_id'
});

Permission.belongsToMany(Role, { 
  through: RolePermission,
  foreignKey: 'permission_id',
  otherKey: 'role_id'
});

// RolePermission associations with Role and Permission
RolePermission.belongsTo(Permission, {
  foreignKey: 'permission_id'
});

Permission.hasMany(RolePermission, {
  foreignKey: 'permission_id'
});

RolePermission.belongsTo(Role, {
  foreignKey: 'role_id'
});

Role.hasMany(RolePermission, {
  foreignKey: 'role_id'
});

export default {
  Permission,
  RolePermission,
  User,
  Task,
  Role
}