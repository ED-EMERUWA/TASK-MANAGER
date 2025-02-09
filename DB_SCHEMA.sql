-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema user_management_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema user_management_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `user_management_db` DEFAULT CHARACTER SET utf8 ;
USE `user_management_db` ;

-- -----------------------------------------------------
-- Table `user_management_db`.`Role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_management_db`.`Role` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `user_management_db`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_management_db`.`User` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `role` INT NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `role_idx` (`role` ASC) VISIBLE,
  CONSTRAINT `role`
    FOREIGN KEY (`role`)
    REFERENCES `user_management_db`.`Role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;  

-- -----------------------------------------------------
-- Table `user_management_db`.`Task`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_management_db`.`Task` (
  `id` INT NOT NULL,
  `Body` VARCHAR(45) NOT NULL,
  `Assignee` INT NOT NULL,
  `AssignedTo` INT NOT NULL,
  `Topic` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `Assignee_idx` (`Assignee` ASC) VISIBLE,
  INDEX `AssignedTo_idx` (`AssignedTo` ASC) VISIBLE,
  CONSTRAINT `fk_Assignee`
    FOREIGN KEY (`Assignee`)
    REFERENCES `user_management_db`.`User` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_AssignedTo`
    FOREIGN KEY (`AssignedTo`)
    REFERENCES `user_management_db`.`User` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `user_management_db`.`Permission`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_management_db`.`Permission` (
  `id` INT NOT NULL,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `user_management_db`.`RolePermission`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_management_db`.`RolePermission` (
  `role_id` INT NOT NULL,
  `permission_id` INT NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  INDEX `permission_id_idx` (`permission_id` ASC) VISIBLE,
  CONSTRAINT `role_id`
    FOREIGN KEY (`role_id`)
    REFERENCES `user_management_db`.`Role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `permission_id`
    FOREIGN KEY (`permission_id`)
    REFERENCES `user_management_db`.`Permission` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

 -- Dummy Data make this inline with the rest of the code:

-- CREATE TABLE IF NOT EXISTS `user_management_db`.`upda` (
--   `updated_id` INT NOT NULL
-- )
-- ENGINE = InnoDB;

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

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
