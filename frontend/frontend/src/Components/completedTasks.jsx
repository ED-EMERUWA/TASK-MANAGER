import { useEffect, useState } from "react";
import { useAuth } from "./Authenticate";
import { useNavigate } from "react-router-dom"

export default function CompletedTasks() {
  const { user, logout } = useAuth();
  const [completedTasks, setCompletedTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const response = await fetch("http://localhost:2173/api/completedtasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
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
                onClick={() =>navigate("/profile")}
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
                onClick={() => navigate("/completed")}
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
          <h1 className="text-3xl font-bold text-purple-700 mb-6 text-center">Completed Tasks</h1>

          {completedTasks.length === 0 ? (
            <p className="text-center text-gray-600">No completed tasks found.</p>
          ) : (
            <ul className="space-y-4">
              {completedTasks.map((task) => (
                <li
                  key={task.id}
                  className="border border-gray-300 rounded-lg p-4 bg-purple-50"
                >
                  <div className="flex justify-between">
                    <h2 className="text-xl font-semibold text-purple-800">{task.Topic}</h2>
                    <p className="text-sm text-gray-500">
                      Completed: {new Date(task.CompletedDate).toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-2 text-gray-700">{task.Body}</p>
                  <p className="mt-2 text-sm italic text-purple-900">
                    Completion Note: "{task.completedNote}"
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
