import { useState } from "react";
import { useAuth } from "./Authenticate.jsx"; // Adjust the import path accordingly


export default function AddTask() {
  
  const { user, logout } = useAuth(); 
  console.log(user)
  const [newTask, setNewTask] = useState({
    Assignee: user.email,
    Topic: "",
    Body: "",
    AssignedTo: "waed@gmail.com"
  });

  const addingTask = async () => {
    try {
        console.log(newTask)
      const response = await fetch("http://localhost:2173/api/addTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask)
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      console.log("Task added successfully!");
      alert("Task added successfully!");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task!");
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold underline" >Add Task</h2>

      

      <input
        type="text"
        placeholder="Topic"
        value={newTask.Topic}
        onChange={(e) => setNewTask({ ...newTask, Topic: e.target.value })}
      />

      <textarea
        placeholder="Body"
        value={newTask.Body}
        onChange={(e) => setNewTask({ ...newTask, Body: e.target.value })}
      />

      <input
        type="email"
        placeholder="Assigned To"
        value={newTask.AssignedTo}
        onChange={(e) => setNewTask({ ...newTask, AssignedTo: e.target.value })}
      />

      <button onClick={addingTask}>
        Submit Task
      </button>
    </div>
  );
}
