import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import RolePermission from "../models/RolePermission.js";
import Permission from "../models/Permission.js";
import Role from "../models/Role.js";

const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const rolePermissions = await RolePermission.findAll({
      where: { role_id: user.role },
      include: [{ model: Permission, as: "Permission", attributes: ["name"] }],
    });

    const permissions = rolePermissions.map((rp) => rp.Permission.name);

    const roleName = await Role.findOne({
      where: { id: user.role },
      attributes: ["name"],
    });

    const username = `${user.firstName} ${user.lastName}`;
    const token = jwt.sign(
      {
        username,
        email: user.email,
        role: roleName.name,
        permissions,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
