import { useEffect, useState } from "react";
import { useAuth } from "./Authenticate.jsx";

import { useNavigate } from "react-router-dom"

export default function AssignedTasks() {
  const { user } = useAuth(); // Get the logged-in user data
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
   const navigate = useNavigate();

  // Fetch the tasks assigned to the user
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:2173/api/assignedTasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }), // Send email as part of the request
        });

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading tasks...</p>;

  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-purple-800 text-white p-4 flex flex-col justify-between">
        <div>
          
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
        </div>

        {/* Logout Button at the Bottom */}
        <button
          onClick={() => {/* logout function here */}}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg mt-auto transition duration-300"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-purple-700 mb-4 text-center">Assigned Tasks</h1>

          {/* Tasks list */}
          {tasks.length === 0 ? (
            <p className="text-center text-gray-600">No tasks assigned.</p>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold text-purple-700">{task.Topic}</h2>
                  <p><strong>Assigned To:</strong> {task.Assignee}</p>
                  <p><strong>Due Date:</strong> {task.DueDate}</p>
                  <p><strong>Status:</strong> {task.CompletedDate ? "Completed" : "Pending"}</p>
                  <p><strong>Description:</strong> {task.Body}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
