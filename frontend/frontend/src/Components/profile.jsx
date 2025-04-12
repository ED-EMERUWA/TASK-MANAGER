// Components/Profile.jsx
import { useAuth } from "./Authenticate.jsx";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <p className="text-center mt-10 text-gray-600">No user data available.</p>;
  console.log(user)

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
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-purple-700 mb-4 text-center">Profile</h1>
          <div className="space-y-4 text-gray-700 text-lg">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role || "User"}</p>
            <p><strong>Organization ID:</strong> {user.org_id || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
