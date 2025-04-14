import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "./models/User.js";
import RolePermission from "./models/RolePermission.js";
import Permission from "./models/Permission.js";
import Role from "./models/Role.js";
import cors from 'cors';
import sequelize from "./configs/database.config.js";
import "./models/association.js"
import Task from "./models/Task.js";
import Org from './models/Org.js'
import tryMail from "./configs/mailer.config.js";