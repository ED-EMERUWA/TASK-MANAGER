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
const app = express();

app.use(express.json()); // Replace bodyParser with built-in JSON middleware
app.use(cors());

const PORT = process.env.SERVER_PORT || 2173; // Define the port
const SECRET_KEY = process.env.SECRET_KEY || "your-secret-key";

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Incoming login request:", { email }); // Log request details

  try {
    // Step 1: Find user by email
    const user = await User.findOne({ where: { email } });
    console.log("User found:", user); // Log user details

    if (!user) {
      console.warn("User not found for email:", email); // Warn if user not found
      return res.status(401).json({ message: "User not found" });
    }

    // Step 2: Compare password
     const isPasswordValid = await bcrypt.compare(password, user.password);
    // const isPasswordValid = password === user.password; // Replace bcrypt with raw comparison for now
    console.log("Password valid:", isPasswordValid); // Log password validation result

    if (!isPasswordValid) {
      console.warn("Invalid credentials for user:", email); // Warn on invalid password
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Step 3: Fetch permissions
    const rolePermissions = await RolePermission.findAll({
      where: { role_id: user.role }, // Match user's role
      include: [{ model: Permission, attributes: ["name"] }],
    });
    console.log("Role permissions fetched:", rolePermissions); // Log permissions

    const permissions = rolePermissions.map((rp) => rp.Permission.name);
    console.log("Parsed permissions:", permissions); // Log parsed permissions

    // Step 4: Generate token
    const username = `${user.firstName} ${user.lastName}`;
    const token = jwt.sign(
      { name: username, email: user.email, role: user.role, permissions },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    console.log("Token generated:", token); // Log generated token

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error in login route:", error); // Log the full error
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post('/api/signup', async (req, res) => {
  const { firstName, lastName, email, role, password } = req.body;  
  console.log(`Signup form recieved at the backend ${req.body}`)

  try {
    // Step 1: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Hash with salt rounds

    // Step 2: Validate if the role exists in the Role model
    const roleRecord = await Role.findOne({ where: { name: role } });

    if (!roleRecord) {
      // If the role doesn't exist, return an error
      return res.status(400).json({ message: "Role not found" });
    }

    // Step 3: Get the role_id from the roleRecord
    const role_id = roleRecord.id;

    // Step 4: Create the user in the User model
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      role: role_id, // Use the role_id
      password: hashedPassword // Store the hashed password
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: roleRecord.name // Return the role name for reference
      }
    });

    console.log("User Crreated Succesfully")
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
