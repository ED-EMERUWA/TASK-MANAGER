var DataTypes = require("sequelize").DataTypes;
var _Org = require("./Org");
var _Permission = require("./Permission");
var _Role = require("./Role");
var _RolePermission = require("./RolePermission");
var _Task = require("./Task");
var _User = require("./User");

function initModels(sequelize) {
  var Org = _Org(sequelize, DataTypes);
  var Permission = _Permission(sequelize, DataTypes);
  var Role = _Role(sequelize, DataTypes);
  var RolePermission = _RolePermission(sequelize, DataTypes);
  var Task = _Task(sequelize, DataTypes);
  var User = _User(sequelize, DataTypes);

  Permission.belongsToMany(Role, { as: 'role_id_Roles', through: RolePermission, foreignKey: "permission_id", otherKey: "role_id" });
  Role.belongsToMany(Permission, { as: 'permission_id_Permissions', through: RolePermission, foreignKey: "role_id", otherKey: "permission_id" });
  Task.belongsTo(Org, { as: "org", foreignKey: "org_id"});
  Org.hasMany(Task, { as: "Tasks", foreignKey: "org_id"});
  User.belongsTo(Org, { as: "org", foreignKey: "org_id"});
  Org.hasMany(User, { as: "Users", foreignKey: "org_id"});
  RolePermission.belongsTo(Permission, { as: "permission", foreignKey: "permission_id"});
  Permission.hasMany(RolePermission, { as: "RolePermissions", foreignKey: "permission_id"});
  RolePermission.belongsTo(Role, { as: "role", foreignKey: "role_id"});
  Role.hasMany(RolePermission, { as: "RolePermissions", foreignKey: "role_id"});
  User.belongsTo(Role, { as: "role_Role", foreignKey: "role"});
  Role.hasMany(User, { as: "Users", foreignKey: "role"});
  Task.belongsTo(User, { as: "AssignedTo_User", foreignKey: "AssignedTo"});
  User.hasMany(Task, { as: "Tasks", foreignKey: "AssignedTo"});
  Task.belongsTo(User, { as: "Assignee_User", foreignKey: "Assignee"});
  User.hasMany(Task, { as: "Assignee_Tasks", foreignKey: "Assignee"});

  return {
    Org,
    Permission,
    Role,
    RolePermission,
    Task,
    User,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
