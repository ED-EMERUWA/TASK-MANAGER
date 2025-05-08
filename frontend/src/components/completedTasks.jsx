import { useEffect, useState } from "react";
import { useAuth } from "./Authenticate";
import { useNavigate } from "react-router-dom";
import { 
  Menu, X, LogOut, Layers, User, PlusCircle, 
  CheckSquare, List, Trash
} from "lucide-react";
import Sidebar from "./sidebar";

export default function CompletedTasks() {
  const { user, logout } = useAuth();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

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
    const fetchCompletedTasks = async () => {
      try {
        const response = await fetch("https://task-flow-backend-bc30.onrender.com/api/completedtasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user?.email }),
        });

        if (!response.ok) throw new Error("Failed to fetch completed tasks");

        const data = await response.json();
        setCompletedTasks(data);
      } catch (error) {
        console.error("Error fetching completed tasks:", error);
      }
    };

    if (user) {
      fetchCompletedTasks();
    }
  }, [user]);

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;
  
    try {
      const res = await fetch(`https://task-flow-backend-bc30.onrender.com/api/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: taskId }),
      });
  
      if (res.ok) {
        setCompletedTasks(prev => prev.filter(task => task.id !== taskId));
      } else {
        console.error("Failed to delete task");
      }
    } catch (err) {
      console.error("Error deleting task:", err);
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
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pt-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 md:p-6 shadow-xl mb-6">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6 text-center">
              Completed Tasks
            </h1>

            {completedTasks.length === 0 ? (
              <div className="text-center p-10 text-gray-400">
                <p className="text-lg">No completed tasks to display</p>
              </div>
            ) : (
              <ul className="space-y-4">
  {completedTasks.map((task) => (
    <li
      key={task.id}
      className="border border-gray-700 rounded-lg p-4 bg-gray-700/40 hover:bg-gray-700/60 transition"
    >
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-1">{task.Topic}</h2>
          <p className="text-gray-300 mb-2 p-3 bg-gray-800 rounded-lg">{task.Body}</p>
          <div className="mt-2">
  <h3 className="text-sm font-semibold text-gray-300 mb-1">Completion Summary</h3>
  <div className="bg-gray-900 border border-emerald-600/40 rounded-md p-3 text-emerald-300 text-sm">
    {task.completedNote || "No note provided."}
  </div>
</div>

        </div>
        <div className="flex flex-col justify-between items-end text-xs md:text-sm text-gray-400">
          <p>Completed: {new Date(task.CompletedDate).toLocaleString()}</p>
          <button
                            onClick={(e) => deleteTask(task.id, e)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                            title="Delete task"
                          >
                            <Trash size={18} />
                          </button>
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