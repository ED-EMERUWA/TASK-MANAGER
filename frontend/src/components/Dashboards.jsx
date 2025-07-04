import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./Authenticate";
import { useNavigate } from "react-router-dom";
import { 
  Menu, X, LogOut, Layers, User, PlusCircle, 
  CheckSquare, List, Clock, AlertTriangle, Trash
} from "lucide-react";
import Sidebar from "./sidebar";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [openTaskIds, setOpenTaskIds] = useState([]);
  const [completedNotes, setCompletedNotes] = useState({});
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCriteriaUpdates, setPendingCriteriaUpdates] = useState({}); // Track pending updates
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
      console.log("ed ovr here from server", data)
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    // remove this for otinoimous loading
  }, []);

  // Calculate progress percentage for a task
  const calculateProgress = (criteria) => {
    if (!criteria || criteria.length === 0) return 0;
    const metCount = criteria.filter(c => c.is_met).length;
    return Math.round((metCount / criteria.length) * 100);
  };

  // Toggle criteria completion locally
  const toggleCriteria = (taskId, criteriaId) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedCriteria = task.Criteria.map(criteria => {
            if (criteria.id === criteriaId) {
              return { ...criteria, is_met: !criteria.is_met };
            }
            return criteria;
          });
          return { ...task, Criteria: updatedCriteria };
        }
        return task;
      })
    );

    // Track this update for batch processing
    setPendingCriteriaUpdates(prev => ({
      ...prev,
      [`${taskId}-${criteriaId}`]: Date.now()
    }));

    // Debounce the server update
    debouncedUpdateCriteria(taskId, criteriaId);
  };

  // Debounced function to update criteria on server
  const debouncedUpdateCriteria = useCallback(
    debounce(async (taskId, criteriaId) => {
      try {
        // Get the current state of the criteria
        const task = tasks.find(t => t.id === taskId);
        const criteria = task?.Criteria.find(c => c.id === criteriaId);
        
        if (!criteria) return;

        const response = await fetch("https://task-flow-backend-bc30.onrender.com/api/update-criteria", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            criteria_id: criteriaId,
            is_met: criteria.is_met
          }),
        });
        const crit_response =  await response.json()
        console.log(crit_response)

        if (!response.ok) throw new Error(`Failed to update criteria: ${response.status}`);
        
        // Remove from pending updates
        setPendingCriteriaUpdates(prev => {
          const newPending = { ...prev };
          delete newPending[`${taskId}-${criteriaId}`];
          return newPending;
        });

      } catch (error) {
        console.error("Error updating criteria:", error);
        // Optionally revert the local change on error
        // You could add error handling here to revert the UI state
      }
    }, 1000),
    [tasks, user]
  );

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
      const response = await fetch(" https://task-flow-backend-bc30.onrender.com/api/updatetasks", {
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

    try {
      const res = await fetch(`https://task-flow-backend-bc30.onrender.com/api/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: taskId }),
      });

      if (res.ok) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
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
                  const progress = calculateProgress(task.Criteria);

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
                          
                          {/* Progress bar in collapsed view */}
                          {task.Criteria && task.Criteria.length > 0 && (
                            <div className="mt-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-gray-400">Progress</span>
                                <span className="text-xs font-medium text-emerald-400">{progress}%</span>
                              </div>
                              <div className="w-full bg-gray-600 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500 ease-out"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
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
                          
                          {/* Criteria section */}
                          {task.Criteria && task.Criteria.length > 0 && (
                            <div className="mb-6">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white">Task Criteria</h3>
                                <div className="text-sm font-medium text-emerald-400">
                                  {task.Criteria.filter(c => c.is_met).length} of {task.Criteria.length} completed
                                </div>
                              </div>
                              
                              {/* Full progress bar in expanded view */}
                              <div className="mb-4">
                                <div className="w-full bg-gray-600 rounded-full h-3">
                                  <div 
                                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500 ease-out relative"
                                    style={{ width: `${progress}%` }}
                                  >
                                    <div className="absolute right-2 top-0 h-full flex items-center">
                                      <span className="text-xs font-bold text-white">{progress}%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Criteria list */}
                              <div className="space-y-2">
                                {task.Criteria.map((criteria) => (
                                  <div 
                                    key={criteria.id}
                                    className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
                                  >
                                    <button
                                      onClick={() => toggleCriteria(task.id, criteria.id)}
                                      className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 ${
                                        criteria.is_met 
                                          ? 'bg-emerald-500 border-emerald-500' 
                                          : 'border-gray-400 hover:border-emerald-400'
                                      }`}
                                    >
                                      {criteria.is_met && (
                                        <CheckSquare size={16} className="text-white m-0.5" />
                                      )}
                                    </button>
                                    <span className={`flex-1 ${
                                      criteria.is_met 
                                        ? 'text-gray-300 line-through' 
                                        : 'text-white'
                                    }`}>
                                      {criteria.criteria_description}
                                    </span>
                                    {pendingCriteriaUpdates[`${task.id}-${criteria.id}`] && (
                                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

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

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}