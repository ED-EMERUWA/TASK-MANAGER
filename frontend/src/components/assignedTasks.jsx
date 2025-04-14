import { useEffect, useState } from "react";
import { useAuth } from "./Authenticate.jsx";
import { useNavigate } from "react-router-dom";
import { 
  Menu, X, LogOut, Layers, User, PlusCircle, 
  CheckSquare, List 
} from "lucide-react";

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
      <header className="sticky top-0 z-20 bg-gray-800 md:hidden flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Task Flow</span>
        </h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors">
          <Menu size={24} />
        </button>
      </header>

      <div className={`fixed md:static inset-y-0 left-0 w-64 bg-gray-800 border-r border-gray-700 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto z-30 md:h-screen`}>
        <div className="hidden md:block p-6">
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Task Flow</span>
          </h1>
        </div>

        <div className="flex justify-end p-4 md:hidden">
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors">
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
                    item.path === "/assigned-tasks"
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

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setSidebarOpen(false)}></div>
      )}

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
                          <strong>Status:</strong> {task.CompletedDate ? "Completed" : "Pending"}
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
