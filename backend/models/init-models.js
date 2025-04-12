import _sequelize from "sequelize";
const DataTypes = _sequelize.DataTypes;
import _Org from "./Org.js";
import _Permission from "./Permission.js";
import _Role from "./Role.js";
import _RolePermission from "./RolePermission.js";
import _Task from "./Task.js";
import _User from "./User.js";

export default function initModels(sequelize) {
  const Org = _Org.init(sequelize, DataTypes);
  const Permission = _Permission.init(sequelize, DataTypes);
  const Role = _Role.init(sequelize, DataTypes);
  const RolePermission = _RolePermission.init(sequelize, DataTypes);
  const Task = _Task.init(sequelize, DataTypes);
  const User = _User.init(sequelize, DataTypes);

  // Many-to-Many: Role <-> Permission via RolePermission
  Permission.belongsToMany(Role, { 
    as: 'role_id_Roles', 
    through: RolePermission, 
    foreignKey: "permission_id", 
    otherKey: "role_id" 
  });
  Role.belongsToMany(Permission, { 
    as: 'permission_id_Permissions', 
    through: RolePermission, 
    foreignKey: "role_id", 
    otherKey: "permission_id" 
  });

  // One-to-Many: Org <-> Task
  Task.belongsTo(Org, { as: "org", foreignKey: "org_id" });
  Org.hasMany(Task, { as: "Tasks", foreignKey: "org_id" });

  // One-to-Many: Org <-> User
  User.belongsTo(Org, { as: "org", foreignKey: "org_id" });
  Org.hasMany(User, { as: "Users", foreignKey: "org_id" });

  // One-to-Many: Role <-> User
  User.belongsTo(Role, { as: "role_Role", foreignKey: "role" });
  Role.hasMany(User, { as: "Users", foreignKey: "role" });

  // One-to-Many: Task <-> User (AssignedTo)
  Task.belongsTo(User, { as: "AssignedTo_User", foreignKey: "AssignedTo" });
  User.hasMany(Task, { as: "AssignedTo_Tasks", foreignKey: "AssignedTo" });

  // One-to-Many: Task <-> User (Assignee)
  Task.belongsTo(User, { as: "Assignee_User", foreignKey: "Assignee" });
  User.hasMany(Task, { as: "Assignee_Tasks", foreignKey: "Assignee" });

  // One-to-Many: RolePermission <-> Permission
  RolePermission.belongsTo(Permission, { as: "permission", foreignKey: "permission_id" });
  Permission.hasMany(RolePermission, { as: "RolePermissions", foreignKey: "permission_id" });

  // One-to-Many: RolePermission <-> Role
  RolePermission.belongsTo(Role, { as: "role", foreignKey: "role_id" });
  Role.hasMany(RolePermission, { as: "RolePermissions", foreignKey: "role_id" });

  return {
    Org,
    Permission,
    Role,
    RolePermission,
    Task,
    User,
  };
}
