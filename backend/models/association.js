<<<<<<< HEAD
    

=======
>>>>>>> master
import Role from "./Role.js";
import RolePermission from "./RolePermission.js";
import User from "./User.js";
import Permission from "./Permission.js";
<<<<<<< HEAD
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

=======
import Task from './Task.js';
import Org from './Org.js';

// ==== User & Role ====
Role.hasMany(User, { 
  foreignKey: 'role',
  as: 'Users'
});
User.belongsTo(Role, { 
  foreignKey: 'role',
  as: 'Role'
});

// ==== User & Org ====
Org.hasMany(User, {
  foreignKey: 'org_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'Users'
});
User.belongsTo(Org, {
  foreignKey: 'org_id',
  as: 'Organization'
});

// ==== Task & Org ====
Org.hasMany(Task, {
  foreignKey: 'org_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  as: 'Tasks'
});
Task.belongsTo(Org, {
  foreignKey: 'org_id',
  as: 'Organization'
});

// ==== Task & User (Assigned To / Assignee) ====
// A user can assign tasks to others
User.hasMany(Task, {
  foreignKey: 'AssignedTo',
  as: 'TasksAssignedTo'
});
Task.belongsTo(User, {
  foreignKey: 'AssignedTo',
  as: 'AssignedToDetails'
});

// A user can be assigned tasks
User.hasMany(Task, {
  foreignKey: 'Assignee',
  as: 'AssignedTasks'
});
Task.belongsTo(User, {
  foreignKey: 'Assignee',
  as: 'AssigneeDetails'
});

// ==== Role & Permission (many-to-many) ====
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

// ==== RolePermission - BelongsTo Role & Permission ====
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

// ==== Export Models ====
>>>>>>> master
export default {
  Permission,
  RolePermission,
  User,
  Task,
<<<<<<< HEAD
  Role
}
=======
  Role,
  Org
};
>>>>>>> master
