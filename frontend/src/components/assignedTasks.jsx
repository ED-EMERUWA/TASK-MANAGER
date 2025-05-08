import { useEffect, useState } from "react";
import { useAuth } from "./Authenticate.jsx";
import { useNavigate } from "react-router-dom";
import { 
  Menu, X, LogOut, Layers, User, PlusCircle, 
  CheckSquare, List 
} from "lucide-react";
import Sidebar from "./sidebar.jsx";

export default function AssignedTasks() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

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
    const fetchTasks = async () => {
      try {
        const response = await fetch("https://task-flow-backend-bc30.onrender.com/api/assignedTasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user?.email }),
        });

        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        setTasks(data);
        console.log(data)
        console.log("task:", tasks)
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchTasks();
  }, [user]);

  const menuItems = [
    { name: "Dashboard", icon: <Layers size={18} />, path: "/dashboard" },
    { name: "Profile", icon: <User size={18} />, path: "/profile" },
    { name: "Add Task", icon: <PlusCircle size={18} />, path: "/add-task" },
    { name: "Completed Tasks", icon: <CheckSquare size={18} />, path: "/completed" },
    { name: "Assigned Tasks", icon: <List size={18} />, path: "/assigned-tasks" }
  ];

  const navigateAndCloseSidebar = (path) => {
    navigate(path);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  if (loading) return <p className="text-center mt-10 text-gray-400 bg-gray-900 min-h-screen flex items-center justify-center">Loading tasks...</p>;
  if (error) return <p className="text-center mt-10 text-red-400 bg-gray-900 min-h-screen flex items-center justify-center">{error}</p>;

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
      )}            {/* Main Content */}

      <main className="flex-1 p-4 md:p-8 pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 md:p-6 shadow-xl mb-6">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6 text-center">
              Assigned Tasks
            </h1>

            {tasks.length === 0 ? (
              <div className="text-center p-10 text-gray-400">
                <p className="text-lg">No tasks assigned</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {tasks.map((task) => (
                  <li key={task.id} className="border border-gray-700 rounded-lg p-4 bg-gray-700/40 hover:bg-gray-700/60 transition">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="text-lg md:text-xl font-semibold text-white mb-1">{task.Topic}</h2>
                        <p className="text-gray-300 mb-2 p-3 bg-gray-800 rounded-lg">{task.Body}</p>
                        <p className="text-sm text-gray-400">
                          <strong>Assigned To:</strong>{" "}
                          {task.AssigneeDetails
                            ? `${task.AssignedToDetails.firstName} ${task.AssignedToDetails.lastName} (${task.AssignedToDetails.email})`
                            : "Unknown User"}
                        </p>
                        <p className={`text-sm ${task.CompletedDate ? "text-emerald-400" : "text-gray-400"}`}>
                          <strong>Status:</strong> {task.completed ? "Completed" : "Pending"}
                        </p>
                      </div>
                      <div className="text-xs md:text-sm text-gray-400">
                        <p><strong>Due Date:</strong> {new Date(task.DueDate).toLocaleString()}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
