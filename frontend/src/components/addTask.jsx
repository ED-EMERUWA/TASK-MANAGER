import { useState, useEffect } from "react";
import { useAuth } from "./Authenticate.jsx";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, Calendar, Users, Menu, X, LogOut, 
  Layers, User, PlusCircle, CheckSquare, List 
} from "lucide-react";

export default function AddTask() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [contacts, setContacts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    Assignee: user?.email || "",
    Topic: "",
    Body: "",
    AssignedTo: "",
    AssignedDate: new Date().toISOString().slice(0, 10),
    DueDate: null,
  });

  // Close sidebar when window is resized to desktop size
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
          headers: {
            "Content-Type": "application/json",
          },
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

  const toMySQLDatetime = (date) => {
    return date.toISOString().slice(0, 19).replace("T", " ");
  };

  const addingTask = async () => {
    try {
      const taskToSend = {
        ...newTask,
        DueDate: newTask.DueDate ? toMySQLDatetime(newTask.DueDate) : null,
      };

      const response = await fetch("https://task-flow-backend-bc30.onrender.com/api/addTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskToSend),
      });

      if (!response.ok) throw new Error("Failed to add task");

      // Clear form after successful submission
      setNewTask({
        ...newTask,
        Topic: "",
        Body: "",
        AssignedTo: "",
        DueDate: null,
      });
      
      // Close sidebar on mobile after task submission
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
      
      alert("Task added successfully!");
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task!");
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <Layers size={18} />, path: "/dashboard" },
    { name: "Profile", icon: <User size={18} />, path: "/profile" },
    { name: "Add Task", icon: <PlusCircle size={18} />, path: "/add-task" },
    { name: "Completed Tasks", icon: <CheckSquare size={18} />, path: "/completed" },
    { name: "Assigned Tasks", icon: <List size={18} />, path: "/assigned-tasks" }
  ];

  const navigateAndCloseSidebar = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (<div className="flex flex-col min-h-screen bg-gray-900 text-white md:flex-row">
    {/* Mobile Header with Hamburger */}
    <header className="sticky top-0 z-20 bg-gray-800 md:hidden flex items-center justify-between p-4 border-b border-gray-700">
      <h1 className="text-xl font-bold">
        <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Task Flow</span>
      </h1>
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
      >
        <Menu size={24} />
      </button>
    </header>
    
    {/* Sidebar - Fixed position on mobile, normal layout on desktop */}
    <div 
      className={`
        fixed md:static inset-y-0 left-0 w-64 md:w-64 bg-gray-800 border-r border-gray-700
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        overflow-y-auto z-30 md:h-screen
      `}
    >
      {/* Desktop Logo - Hidden on mobile */}
      <div className="hidden md:block p-6">
        <h1 className="text-2xl font-bold">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Task Flow</span>
        </h1>
      </div>
      
      {/* Close button for mobile sidebar */}
      <div className="flex justify-end p-4 md:hidden">
        <button 
          onClick={() => setSidebarOpen(false)}
          className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="px-4 py-2">
        <div className="bg-gray-700/50 rounded-md p-3 mb-6">
          <p className="text-sm text-gray-400">Signed in as</p>
          <p className="truncate font-medium">{user?.email}</p>
        </div>
      </div>
      
      <nav className="px-3 pb-10">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigateAndCloseSidebar(item.path)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${
                  item.path === "/add-task" 
                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400" 
                    : "hover:bg-gray-700/70 text-gray-300"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition duration-200"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  
    {/* Overlay for mobile when sidebar is open */}
    {sidebarOpen && (
      <div 
        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
        onClick={() => setSidebarOpen(false)}
      ></div>
    )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pt-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Create New Task</h2>
            <p className="text-gray-400">Delegate tasks and track progress efficiently</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 md:p-6 shadow-xl space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Task Title</label>
              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTask.Topic}
                onChange={(e) => setNewTask({ ...newTask, Topic: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Task Description</label>
              <textarea
                placeholder="Add details about this task..."
                value={newTask.Body}
                onChange={(e) => setNewTask({ ...newTask, Body: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Assign To</label>
              <div className="relative">
                <select
                  value={newTask.AssignedTo}
                  onChange={(e) => setNewTask({ ...newTask, AssignedTo: e.target.value })}
                  className="w-full appearance-none px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white pr-10"
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
                <label className="block text-sm font-medium text-gray-400 mb-1">Assigned Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={newTask.AssignedDate}
                    disabled
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Due Date & Time</label>
                <div className="relative">
                  <DatePicker
                    selected={newTask.DueDate}
                    onChange={(date) => setNewTask({ ...newTask, DueDate: date })}
                    showTimeSelect
                    dateFormat="yyyy-MM-dd h:mm aa"
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500"
                    placeholderText="Select deadline"
                    popperClassName="react-datepicker-dark"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                    <Calendar size={18} />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={addingTask}
              className="w-full py-3 px-4 mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              Create Task <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}