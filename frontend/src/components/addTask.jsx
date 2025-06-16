// frontend/src/components/addTask.jsx

import { useState, useEffect } from "react";
import { useAuth } from "./Authenticate.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, Users, Menu } from "lucide-react";
import Sidebar from "./sidebar.jsx"; // Import the shared Sidebar

export default function AddTask() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [newCriterion, setNewCriterion] = useState("");


  const [contacts, setContacts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    Assignee: user?.email || "",
    Topic: "",
    Body: "",
    AssignedTo: "",
    AssignedDate: new Date().toISOString().slice(0, 10),
    DueDate: null,
    Criteria: [], // Add this
  });
  

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("https://task-flow-backend-bc30.onrender.com/api/getContacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user?.email }),
        });

        if (!response.ok) throw new Error("Failed to fetch contacts");
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };
    if (user) fetchContacts();
  }, [user]);

  const toMySQLDatetime = (date) =>
    date.toISOString().slice(0, 19).replace("T", " ");

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

      setNewTask({
        ...newTask,
        Topic: "",
        Body: "",
        AssignedTo: "",
        DueDate: null,
      });

      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }

      alert("Task added successfully!");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white md:flex-row">
     {/* Mobile header */}
     <header className="sticky top-0 z-20 bg-gray-800 md:hidden flex items-center justify-between p-4 border-b border-gray-700">
       <h1 className="text-xl font-bold">
         <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Task Flow</span>
       </h1>
       <button
         onClick={() => setSidebarOpen(!sidebarOpen)}
         className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-colors"
       >
         <Menu size={24} />
       </button>
     </header>
   
     {/* Sidebar */}
     <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
   
     {/* Backdrop for mobile */}
     {sidebarOpen && (
       <div
         className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
         onClick={() => setSidebarOpen(false)}
       ></div>
     )}

     {/* Main content */}
<main className="flex-1 p-4 md:p-8 pt-4">
  <div className="max-w-2xl mx-auto">
    <div className="mb-6 md:mb-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-emerald-400">Create New Task</h2>
      <p className="text-gray-300">Delegate tasks and track progress efficiently</p>
    </div>

    <div className="bg-gray-800 border border-teal-500 rounded-xl p-4 md:p-6 shadow-xl space-y-4 md:space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Task Title</label>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTask.Topic}
          onChange={(e) => setNewTask({ ...newTask, Topic: e.target.value })}
          className="w-full px-4 py-3 bg-gray-900 border border-teal-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Task Description</label>
        <textarea
          placeholder="Add details about this task..."
          value={newTask.Body}
          onChange={(e) => setNewTask({ ...newTask, Body: e.target.value })}
          rows={4}
          className="w-full px-4 py-3 bg-gray-900 border border-teal-500 rounded-lg text-white resize-none placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div>
  <label className="block text-sm font-medium text-gray-300 mb-1">Completion Criteria</label>
  <div className="flex gap-2 mb-2">
    <input
      type="text"
      placeholder="Add a criterion..."
      value={newCriterion}
      onChange={(e) => setNewCriterion(e.target.value)}
      className="flex-1 px-4 py-2 bg-gray-900 border border-teal-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
    />
    <button
      type="button"
      onClick={() => {
        if (newCriterion.trim()) {
          setNewTask((prev) => ({
            ...prev,
            Criteria: [...prev.Criteria, newCriterion.trim()],
          }));
          setNewCriterion("");
        }
      }}
      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition"
    >
      Add
    </button>
  </div>

  <ul className="space-y-1">
    {newTask.Criteria.map((criterion, index) => (
      <li key={index} className="flex items-center justify-between bg-gray-700 px-4 py-2 rounded">
        <span>{criterion}</span>
        <button
          type="button"
          onClick={() =>
            setNewTask((prev) => ({
              ...prev,
              Criteria: prev.Criteria.filter((_, i) => i !== index),
            }))
          }
          className="text-red-400 hover:text-red-600"
        >
          Remove
        </button>
      </li>
    ))}
  </ul>
</div>


      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Assign To</label>
        <div className="relative">
          <select
            value={newTask.AssignedTo}
            onChange={(e) => setNewTask({ ...newTask, AssignedTo: e.target.value })}
            className="w-full appearance-none px-4 py-3 bg-gray-900 border border-teal-500 rounded-lg text-white pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select Team Member</option>
            {contacts.map((contact) => (
              <option key={contact.id} value={contact.email}>
                {contact.firstName} {contact.lastName} ({contact.email})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <Users size={18} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Assigned Date</label>
          <input
            type="date"
            value={newTask.AssignedDate}
            disabled
            className="w-full px-4 py-3 bg-gray-900/60 border border-teal-500 rounded-lg text-gray-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Due Date & Time</label>
          <div className="relative">
            <DatePicker
              selected={newTask.DueDate}
              onChange={(date) => setNewTask({ ...newTask, DueDate: date })}
              showTimeSelect
              dateFormat="yyyy-MM-dd h:mm aa"
              timeFormat="HH:mm"
              timeIntervals={15}
              className="w-full px-4 py-3 bg-gray-900 border border-teal-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholderText="Select deadline"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <Calendar size={18} />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={addingTask}
        className="w-full py-3 px-4 mt-4 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg"
      >
        Create Task <ArrowRight size={18} />
      </button>
    </div>
  </div>
</main>

    </div>
  );
}
