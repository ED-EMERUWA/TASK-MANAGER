import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./Authenticate";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [openTaskIds, setOpenTaskIds] = useState([]);
  const [completedNotes, setCompletedNotes] = useState({});
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch("http://localhost:2173/api/tasks", {
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

  const toggleTask = (id) => {
    setOpenTaskIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleComplete = async (taskId, note) => {
    console.log(`Completed Note for Task ${taskId}:`, note);

    try {
      const response = await fetch("http://localhost:2173/api/updatetasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          task_id: taskId,
          completedNote: note,
        }),
      });

      if (!response.ok) throw new Error(`Failed to update task: ${response.status}`);
      await fetchTasks(); // re-fetch after update
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const filteredTasks = showOverdueOnly
    ? tasks.filter((task) => new Date(task.DueDate) < new Date())
    : tasks;

  const deleteTask= async (id) =>{

try{
response=fetch("http://localhost:2173/api/deletetasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          task_id: taskId,
        }),
      });

      if (!response.ok) throw new Error(`Failed to update task: ${response.status}`);

       
    }
    catch(e){
      console.error("Error deleting task:", error);
    }
    
  }
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-purple-800 text-white p-4 flex flex-col justify-between">
        <div>
          <ul className="space-y-4">
            <li>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full text-left text-lg hover:bg-purple-700 px-4 py-2 rounded-lg"
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left text-lg hover:bg-purple-700 px-4 py-2 rounded-lg"
              >
                Profile
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/add-task")}
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
        </div>

        {/* Logout Button at the Bottom */}
        <button
          onClick={logout}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg mt-auto transition duration-300"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">Dashboard</h1>

          {/* Toggle switch */}
          <div className="flex justify-end items-center mb-6">
            <div className="flex items-center space-x-4">
              <span className="text-md font-semibold text-gray-700">Show Only Overdue</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showOverdueOnly}
                  onChange={() => setShowOverdueOnly(!showOverdueOnly)}
                />
                <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-purple-600 transition-all duration-300"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>

          <ul className="space-y-4">
            {filteredTasks.map((task) => {
              const dueDate = new Date(task.DueDate);
              const assignedDate = new Date(task.AssignedDate);
              const isPastDue = dueDate < new Date();
              const isOpen = openTaskIds.includes(task.id);

              return (
                <li
                  key={task.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-purple-50 transition cursor-pointer"
                  onClick={() => toggleTask(task.id)}
                >
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-purple-800">{task.Topic}</h2>
                    <div className="text-right text-sm font-medium space-y-1">
                      <p className="text-gray-500">Assigned: {assignedDate.toLocaleString()}</p>
                      <p className={isPastDue ? "text-red-600" : "text-green-600"}>
                        Due: {dueDate.toLocaleString()}{" "}
                        {isPastDue && <span className="font-semibold">(Overdue)</span>}
                      </p>
                    </div>
                    <button  class="text-red-600" onClick={() => deleteTask(task.id)}>Delete</button>
                  </div>

                  {isOpen && (
                    <div className="mt-4 space-y-3">
                      <p className="text-gray-700">{task.Body}</p>
                      <textarea
                        placeholder="Add a completion note..."
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400 text-gray-900"
                        rows={3}
                        value={completedNotes[task.id] || ""}
                        onChange={(e) =>
                          setCompletedNotes({
                            ...completedNotes,
                            [task.id]: e.target.value,
                          })
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComplete(task.id, completedNotes[task.id] || "");
                        }}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                      >
                        Mark Complete
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
