-- Add Permissions
INSERT INTO `user_management_db`.`Permission` (`id`, `name`) VALUES
(1, 'assigntasks'),
(2, 'deletetasks');

-- Add Roles
INSERT INTO `user_management_db`.`Role` (`id`, `name`) VALUES
(1, 'teacher'),
(2, 'admin');

-- Link Permissions to Roles
INSERT INTO `user_management_db`.`RolePermission` (`role_id`, `permission_id`) VALUES
(2, 1), -- Admin can assign tasks
(2, 2), -- Admin can delete tasks
(1, 1); -- Teacher can assign tasks

-- Add Users
INSERT INTO `user_management_db`.`User` (`id`, `firstName`, `lastName`, `email`, `role`, `password`) VALUES
(1, 'John', 'Doe', 'teacher@example.com', 1, '$2b$10$hashedpasswordforteacher'),
(2, 'Jane', 'Smith', 'admin@example.com', 2, '$2b$10$hashedpasswordforadmin');