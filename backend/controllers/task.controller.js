// controllers/task.controller.js
import Task from "../models/Task.js";
import User from "../models/User.js";

export const getTasks = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const tasks = await Task.findAll({
      where: { Assignedto: user.id, org_id: user.org_id, completed: false },
      order: [['AssignedDate', 'DESC']]
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const addTask = async (req, res) => {
  const { Assignee, Topic, Body, AssignedTo, AssignedDate, DueDate } = req.body;
  try {
    const boss = await User.findOne({ where: { email: Assignee } });
    const emp = await User.findOne({ where: { email: AssignedTo } });
    if (!boss || !emp) return res.status(404).json({ message: "Users not found" });

    await Task.create({
      Body,
      Topic,
      Assignee: boss.id,
      AssignedTo: emp.id,
      AssignedDate: new Date(AssignedDate),
      DueDate: DueDate ? new Date(DueDate) : null,
      org_id: boss.org_id,
    });

    res.status(201).json({ message: "Task created successfully" });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add the rest: updateTask, deleteTask, getCompletedTasks, getAssignedTasks, etc.
