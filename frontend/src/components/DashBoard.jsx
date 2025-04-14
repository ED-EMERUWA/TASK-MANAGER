import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./Authenticate";
import { useNavigate } from "react-router-dom";
import { 
  Menu, X, LogOut, Layers, User, PlusCircle, 
  CheckSquare, List, Clock, AlertTriangle, Trash
} from "lucide-react";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [openTaskIds, setOpenTaskIds] = useState([]);
  const [completedNotes, setCompletedNotes] = useState({});
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch("https://task-flow-backend-bc30.onrender.com/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      if (!response.ok) throw new Error(`Failed to fetch tasks: ${response.status}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/login");
      return;
    }

    fetchTasks();
  }, [user, loading, navigate, fetchTasks]);

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

  const toggleTask = (id) => {
    setOpenTaskIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleComplete = async (taskId, note) => {
    try {
      const response = await fetch("https://task-flow-backend-bc30.onrender.com/api/updatetasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          task_id: taskId,
          completedNote: note,
        }),
      });

      if (!response.ok) throw new Error(`Failed to update task: ${response.status}`);
      
      // Clear the completed note for this task
      setCompletedNotes({
        ...completedNotes,
        [taskId]: ""
      });
      
      await fetchTasks(); // re-fetch after update
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId, e) => {
    e.stopPropagation(); // Prevent task from expanding when clicking delete
    
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

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

  const filteredTasks = showOverdueOnly
    ? tasks.filter((task) => new Date(task.DueDate) < new Date())
    : tasks;

  const navigateAndCloseSidebar = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <Layers size={18} />, path: "/dashboard" },
    { name: "Profile", icon: <User size={18} />, path: "/profile" },
    { name: "Add Task", icon: <PlusCircle size={18} />, path: "/add-task" },
    { name: "Completed Tasks", icon: <CheckSquare size={18} />, path: "/completed" },
    { name: "Assigned Tasks", icon: <List size={18} />, path: "/assigned-tasks" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white md:flex-row">
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
        className={`fixed md:static inset-y-0 left-0 w-64 md:w-64 bg-gray-800 border-r border-gray-700
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
                    item.path === "/dashboard" 
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
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 md:p-6 shadow-xl mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Your Tasks
              </h1>
              
              {/* Toggle switch */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300">Show Overdue Only</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={showOverdueOnly}
                    onChange={() => setShowOverdueOnly(!showOverdueOnly)}
                  />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-emerald-500 peer-focus:ring-2 peer-focus:ring-emerald-500/50 transition-all duration-300"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"></div>
                </label>
              </div>
            </div>

            {filteredTasks.length === 0 ? (
              <div className="text-center p-10 text-gray-400">
                <p className="text-lg">No tasks to display</p>
                <p className="text-sm mt-2">
                  {showOverdueOnly ? "You don't have any overdue tasks" : "Your task list is empty"}
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {filteredTasks.map((task) => {
                  const dueDate = new Date(task.DueDate);
                  const assignedDate = new Date(task.AssignedDate);
                  const isPastDue = dueDate < new Date();
                  const isOpen = openTaskIds.includes(task.id);

                  return (
                    <li
                      key={task.id}
                      className="border border-gray-700 rounded-lg overflow-hidden bg-gray-700/40 hover:bg-gray-700/60 transition cursor-pointer"
                    >
                      <div 
                        className="p-4 flex flex-col md:flex-row justify-between gap-4"
                        onClick={() => toggleTask(task.id)}
                      >
                        <div className="flex-1">
                          <h2 className="text-lg md:text-xl font-semibold text-white mb-1">{task.Topic}</h2>
                          <p className="text-sm text-gray-400 line-clamp-1">{task.Body}</p>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                          <div className="text-xs md:text-sm space-y-1 md:text-right">
                            <div className="flex items-center gap-1 text-gray-400">
                              <Clock size={14} />
                              <span>{assignedDate.toLocaleDateString()}</span>
                            </div>
                            <div className={`flex items-center gap-1 ${isPastDue ? "text-red-400" : "text-emerald-400"}`}>
                              {isPastDue ? <AlertTriangle size={14} /> : <Clock size={14} />}
                              <span>
                                {dueDate.toLocaleDateString()}{" "}
                                {isPastDue && "(Overdue)"}
                              </span>
                            </div>
                          </div>
                          
                          <button
                            onClick={(e) => deleteTask(task.id, e)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                            title="Delete task"
                          >
                            <Trash size={18} />
                          </button>
                        </div>
                      </div>

                      {isOpen && (
                        <div className="p-4 pt-0 border-t border-gray-700 mt-2" onClick={(e) => e.stopPropagation()}>
                          <p className="text-gray-300 mb-4 p-3 bg-gray-800 rounded-lg">{task.Body}</p>
                          <div className="space-y-3">
                            <textarea
                              placeholder="Add a completion note..."
                              className="w-full border border-gray-600 rounded-lg p-3 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder-gray-500"
                              rows={3}
                              value={completedNotes[task.id] || ""}
                              onChange={(e) =>
                                setCompletedNotes({
                                  ...completedNotes,
                                  [task.id]: e.target.value,
                                })
                              }
                            />
                            <button
                              onClick={() => handleComplete(task.id, completedNotes[task.id] || "")}
                              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                            >
                              <CheckSquare size={18} />
                              Mark Complete
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}