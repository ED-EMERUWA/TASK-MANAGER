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



// api endpoint

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
      where: { role_id: user.role },
      include: [{ model: Permission, as: 'Permission', attributes: ["name"] }],
    });
    
    console.log("Role permissions fetched:", rolePermissions); // Log permissions

    const permissions = rolePermissions.map((rp) => rp.Permission.name);
    console.log("Parsed permissions:", permissions); // Log parsed permissions

    const roleName = await Role.findOne({
      where: { id: user.role },
      attributes: ['name'],  // assuming 'name' is the field holding the role name
    });
    console.log("raga:",roleName.name)


    // Step 4: Generate token
    const username = `${user.firstName} ${user.lastName}`;
    
    const token = jwt.sign(
      { username: username, email: user.email, role: roleName, permissions },
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

  const { firstName, lastName, email, role, password, userOrg } = req.body;  
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

    // Step 3: Get the role_id from the roleRecord and identify the organization
    const role_id = roleRecord.id;
    const org = await Org.findOne({
      where: { id: userOrg },
      attributes: ['id'], // Only fetch the `id`
    });

    console.log("user org",userOrg)
    
    const org_id = org ? org.id : null;
    
    // Step 4: Create the user in the User model
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      role: role_id, // Use the role_id
      password: hashedPassword, // Store the hashed password
      org_id : org_id
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

app.post('/api/tasks', async (req, res) => {
  try {
    const  userEmail  = req.body;
    console.log('Request body:', req.body); // Better logging
    console.log('Request body email :', userEmail); // Better logging

    // Find user by email
    const user = await User.findOne({ where: { email: userEmail.email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' }); // Return a 404 if user doesn't exist
    }

    console.log('User found:', user);

    // Fetch tasks assigned to the user
    const tasks = await Task.findAll({ where: { Assignedto: user.id,  org_id: user.org_id,
      completed: false } });

    console.log('Tasks found:', tasks);

    res.json(tasks); // Send JSON response
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' }); // Handle server errors
  }
});

app.post('/api/addTask', async (req, res) => {
  const { Assignee, Topic, Body, AssignedTo, AssignedDate, DueDate } = req.body;
  console.log("Incoming task data:", req.body);

  try {
    // Find both users by email
    const boss = await User.findOne({ where: { email: Assignee } });
    const emp = await User.findOne({ where: { email: AssignedTo } });

    if (!boss || !emp) {
      return res.status(404).json({ message: "Assignee or AssignedTo user not found" });
    }

    // Create the task with the org_id from the Assignee (boss)
    await Task.create({
      Body,
      Topic,
      Assignee: boss.id,
      AssignedTo: emp.id,
      AssignedDate: AssignedDate ? new Date(AssignedDate) : new Date(),
      DueDate: DueDate ? new Date(DueDate) : null,
      org_id: boss.org_id,
    });

    res.status(201).json({ message: "Task created successfully" });

  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Server error" });
  }
});
  app.get('/api/orgs', async (req,res)=>{
    try{
      const fetchedOrg = await Org.findAll()
      res.json(fetchedOrg)
    }
    catch (e){
console.log("Could not get organizations ", error.e)
    }
  })




  app.put('/api/updatetasks', async (req, res) => {
    const { email, task_id, completedNote } = req.body;
  
    if (!task_id || completedNote === undefined) {
      return res.status(400).json({ error: 'Missing task_id or completedNote' });
    }
  
    try {
      const [updated] = await Task.update(
        {
          completedNote: completedNote,
          CompletedDate: new Date(),
          completed: true,
        },
        {
          where: {
            id: task_id,
          },
        }
      );
  
      if (updated === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/completedtasks', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ where: { email } });
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const completedTasks = await Task.findAll({
        where: {
          AssignedTo: user.id,
          completed: true
        },
        order: [['CompletedDate', 'DESC']]
      });
  
      res.json(completedTasks);
    } catch (error) {
      console.error("Error fetching completed tasks:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  app.post('/api/getContacts', async (req, res) => {
    const { email } = req.body; // Get email from the body of the request
    
    try {
      // Find the user by email
      const user = await User.findOne({ where: { email } });
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Find all contacts within the same organization as the user
      const contacts = await User.findAll({ where: { org_id: user.org_id } });
  
      if (!contacts || contacts.length === 0) {
        return res.status(404).json({ message: "No contacts found" });
      }
  
      // Return the contacts
      res.json(contacts);
    } catch (error) {
      console.error("Error getting contacts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });app.post('/api/assignedTasks', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const tasks = await Task.findAll({
        where: { AssignedTo: user.id }, // fetch tasks assigned *to* the user
        include: [
          { model: User, as: 'AssigneeDetails', attributes: ['id', 'firstName'] },
          { model: User, as: 'AssignedToDetails', attributes: ['id', 'firstName', 'lastName', ] }
        ]
      
      });
  
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });

  app.delete('/api/delete', async (req, res) => {
    const taskId = req.body;
    console.log(taskId)
    try {
      const deleted = await Task.destroy({ where: { id: taskId.id } });
  
      if (deleted) {
        res.status(200).json({ message: "Task deleted successfully." });
      } else {
        res.status(404).json({ message: "Task not found." });
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });
  
      
// Start the server
app.listen(PORT, () => {  
  console.log(`Server is running on http://localhost:${PORT}`);
});
