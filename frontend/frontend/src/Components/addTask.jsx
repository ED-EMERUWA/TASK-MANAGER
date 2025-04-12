import { useState, useEffect } from "react";
import { useAuth } from "./Authenticate.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom"

export default function AddTask() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [contacts, setContacts] = useState([]); // Store the list of contacts
  const [newTask, setNewTask] = useState({
    Assignee: user?.email || "",
    Topic: "",
    Body: "",
    AssignedTo: "", // Set default to empty string
    AssignedDate: new Date().toISOString().slice(0, 10),
    DueDate: null,
  });

  // Fetch contacts (users) when the component is mounted
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("http://localhost:2173/api/getContacts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user?.email }), // Send the user's email as the payload
        });
        
        if (!response.ok) throw new Error("Failed to fetch contacts");

        const data = await response.json();
        console.log(data)
        setContacts(data); // Set the contacts to state
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    if (user) fetchContacts();
  }, [user]);

  const toMySQLDatetime = (date) => {
    return date.toISOString().slice(0, 19).replace("T", " ");
  };

  const addingTask = async () => {
    try {
      const taskToSend = {
        ...newTask,
        DueDate: newTask.DueDate ? toMySQLDatetime(newTask.DueDate) : null,
      };

      const response = await fetch("http://localhost:2173/api/addTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskToSend),
      });

      if (!response.ok) throw new Error("Failed to add task");

      alert("Task added successfully!");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task!");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-purple-800 text-white p-4 flex flex-col">
    
        <ul className="space-y-4 flex-1">
          <li>
            <button
              onClick={() =>navigate("/dashboard")}
              className="w-full text-left text-lg hover:bg-purple-700 px-4 py-2 rounded-lg"
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() =>navigate("/profile")}
              className="w-full text-left text-lg hover:bg-purple-700 px-4 py-2 rounded-lg"
            >
              Profile
            </button>
          </li>
          <li>
            <button
              onClick={() =>navigate("/add-task")}
              className="w-full text-left text-lg hover:bg-purple-700 px-4 py-2 rounded-lg"
            >
              Add Task
            </button>
          </li>
          <li>
            <button
              onClick={() =>navigate("/completed")}
              className="w-full text-left text-lg hover:bg-purple-700 px-4 py-2 rounded-lg"
            >
              Completed Tasks
            </button>
          </li>

          <li>
            <button
              onClick={() =>navigate("/assigned-tasks")}
              className="w-full text-left text-lg hover:bg-purple-700 px-4 py-2 rounded-lg"
            >
              Assigned Tasks
            </button>
          </li>
        </ul>
        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg space-y-4 mx-auto">
          <h2 className="text-2xl font-bold text-purple-700 text-center">Add Task</h2>

          <input
            type="text"
            placeholder="Topic"
            value={newTask.Topic}
            onChange={(e) => setNewTask({ ...newTask, Topic: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700"
          />

          <textarea
            placeholder="Body"
            value={newTask.Body}
            onChange={(e) => setNewTask({ ...newTask, Body: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700"
          />

          {/* Assigned To Dropdown */}
          <select
            value={newTask.AssignedTo}
            onChange={(e) => setNewTask({ ...newTask, AssignedTo: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700"
          >
            <option value="">Select Contact</option>
{contacts.map((contact) => (
  <option key={contact.id} value={contact.email}>
    {contact.firstName} {contact.lastName} ({contact.email})
  </option>
))}

          </select>

          <div className="flex justify-between gap-4">
            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1">Assigned Date</label>
              <input
                type="date"
                value={newTask.AssignedDate}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1">Due Date & Time</label>
              <DatePicker
                selected={newTask.DueDate}
                onChange={(date) => setNewTask({ ...newTask, DueDate: date })}
                showTimeSelect
                dateFormat="yyyy-MM-dd h:mm aa"
                timeFormat="HH:mm"
                timeIntervals={15}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700"
                placeholderText="Select date and time"
              />
            </div>
          </div>

          <button
            onClick={addingTask}
            className="w-full py-2 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition duration-300"
          >
            Submit Task
          </button>
        </div>
      </div>
    </div>
  );
}
