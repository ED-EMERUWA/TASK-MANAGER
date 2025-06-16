
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
import CompletionCriteria from "./models/CompletionCriteria.js";



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

  const { firstName, lastName, email, role, password, orgPassword } = req.body;  
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
      where: { passcode: orgPassword },
      attributes: ['id'], // Only fetch the `id`
    });
    console.log(orgPassword)
    console.log("user org",org)
    
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
    const userEmail = req.body;
    console.log('Request body:', req.body);
    console.log('Request body email :', userEmail);

    // Find user by email
    const user = await User.findOne({ where: { email: userEmail.email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found:', user);

    // Fetch tasks assigned to the user and include their CompletionCriteria
    const tasks = await Task.findAll({
      where: {
        Assignedto: user.id,
        org_id: user.org_id,
        completed: false,
      },
      include: [
        {
          model: CompletionCriteria,
          as: 'Criteria', // <- match the alias exactly
          required: false,
          attributes: ['id', 'criteria_description', 'is_met'],
        },
      ],
      order: [['AssignedDate', 'ASC']],
    });
    
    console.log('Tasks found:', tasks);

    res.json(tasks); // Send JSON response
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/addTask', async (req, res) => {
  const {
    Assignee,
    Topic,
    Body,
    AssignedTo,
    AssignedDate,
    DueDate,
    Criteria = [], // default to empty array
  } = req.body;

  console.log(Criteria)

  console.log("Incoming task data:", req.body);

  try {
    // Find both users by email
    const boss = await User.findOne({ where: { email: Assignee } });
    const emp = await User.findOne({ where: { email: AssignedTo } });

    if (!boss || !emp) {
      return res.status(404).json({ message: "Assignee or AssignedTo user not found" });
    }

    // Create the task
    const newTask = await Task.create({
      Body,
      Topic,
      Assignee: boss.id,
      AssignedTo: emp.id,
      AssignedDate: AssignedDate ? new Date(AssignedDate) : new Date(),
      DueDate: DueDate ? new Date(DueDate) : null,
      org_id: boss.org_id,
    });

    // Optionally create completion criteria
    if (Array.isArray(Criteria) && Criteria.length > 0) {
      const criteriaToCreate = Criteria.map((criteria_description) => ({
        criteria_description,
        task_id: newTask.id,
      }));

      await CompletionCriteria.bulkCreate(criteriaToCreate);
      console.log("Completion criteria created:", criteriaToCreate);
    }

    res.status(201).json({ message: "Task and criteria created successfully" });

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
    console.log(req.body)
    if (!task_id ) {
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
        where: { Assignee: user.id }, // fetch tasks assigned *to* the user
        include: [
          { model: User, as: 'AssigneeDetails', attributes: ['id', 'firstName'] },
          { model: User, as: 'AssignedToDetails', attributes: ['id', 'firstName', 'lastName', ] }
        ],
        order: [['CompletedDate', 'DESC']]
      
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

  // Update individual criteria endpoint
app.put('/api/update-criteria', async (req, res) => {
  const { email, criteria_id, is_met } = req.body;

  try {
    // Find user first to verify permissions
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Find the criteria and verify it belongs to a task assigned to this user
    const criteria = await CompletionCriteria.findOne({
      where: { id: criteria_id },
      include: [{
        model: Task,
        as: 'Task',
        where: { AssignedTo: user.id }
      }]
    });

    if (!criteria) {
      return res.status(404).json({ message: "Criteria not found or not authorized" });
    }

    // Update the criteria
    await criteria.update({ is_met: !is_met });

    res.json({ 
      message: "Criteria updated successfully",
      criteria: {
        id: criteria.id,
        criteria_description: criteria.criteria_description,
        is_met: criteria.is_met
      }
    });

  } catch (error) {
    console.error("Error updating criteria:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Batch update multiple criteria (optional - for efficiency)
app.put('/api/update-criteria-batch', async (req, res) => {
  const { email, updates } = req.body; // updates: [{ criteria_id, is_met }, ...]

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate all criteria belong to user's tasks
    const criteriaIds = updates.map(update => update.criteria_id);
    
    const userCriteria = await CompletionCriteria.findAll({
      where: { id: criteriaIds },
      include: [{
        model: Task,
        as: 'Task',
        where: { AssignedTo: user.id }
      }]
    });

    if (userCriteria.length !== criteriaIds.length) {
      return res.status(403).json({ message: "Some criteria not found or not authorized" });
    }

    // Perform batch update
    const updatePromises = updates.map(update => 
      CompletionCriteria.update(
        { is_met: update.is_met },
        { where: { id: update.criteria_id } }
      )
    );

    await Promise.all(updatePromises);

    // Return updated criteria
    const updatedCriteria = await CompletionCriteria.findAll({
      where: { id: criteriaIds },
      attributes: ['id', 'criteria_description', 'is_met']
    });

    res.json({ 
      message: "Criteria updated successfully",
      updated_count: updates.length,
      criteria: updatedCriteria
    });

  } catch (error) {
    console.error("Error batch updating criteria:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get task progress (optional endpoint for progress calculation)
app.post('/api/task-progress', async (req, res) => {
  const { email, task_id } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const task = await Task.findOne({
      where: { 
        id: task_id,
        AssignedTo: user.id 
      },
      include: [{
        model: CompletionCriteria,
        attributes: ['id', 'criteria_description', 'is_met']
      }]
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found or not authorized" });
    }

    const totalCriteria = task.CompletionCriteria.length;
    const completedCriteria = task.CompletionCriteria.filter(c => c.is_met).length;
    const progress = totalCriteria > 0 ? Math.round((completedCriteria / totalCriteria) * 100) : 0;

    res.json({
      task_id: task.id,
      total_criteria: totalCriteria,
      completed_criteria: completedCriteria,
      progress_percentage: progress,
      criteria: task.CompletionCriteria
    });

  } catch (error) {
    console.error("Error fetching task progress:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
  
      
// Start the server
app.listen(PORT, () => {  
  console.log(`Server is running on http://localhost:${PORT}`);
});







// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import sequelize from './configs/database.config.js';
// import './models/association.js';

// import authRoutes from './routes/auth.routes.js';
// import taskRoutes from './routes/task.routes.js';
// import userRoutes from './routes/user.routes.js';
// import orgRoutes from './routes/org.routes.js';

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Register Routes
// app.use('/api', authRoutes);
// app.use('/api', taskRoutes);
// app.use('/api', userRoutes);
// app.use('/api', orgRoutes);

// const PORT = process.env.SERVER_PORT || 2173;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });


