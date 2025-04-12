import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Authenticate.jsx";

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Optional: redirect if no user
    // if (!user) navigate("/login");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-purple-500 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-lg w-full text-center">
        {/* Main Content */}
        <p className="text-xl text-gray-700 mb-6">
          The ultimate tool for managing and tracking your tasks with ease.
        </p>

        {/* Features Section */}
        <div className="text-left mb-6 space-y-4">
          <h2 className="text-2xl font-semibold text-purple-600">Key Features:</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Efficient task management and organization</li>
            <li>Due date tracking and notifications</li>
            <li>Task completion notes for better tracking</li>
            <li>Collaborative task assignments with roles and permissions</li>
          </ul>
        </div>

        {/* Conditional Rendering Based on User */}
        {user ? (
          <>
            <p className="text-gray-700 mb-2">Welcome back, {user.username}!</p>
            <p className="text-gray-700 mb-2">Email: {user.email}</p>
            <p className="text-gray-700 mb-6">Role: {user.role}</p>

            <button
              onClick={logout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-700 mb-4">Please log in to access your tasks.</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              Go to Login
            </button>
          </>
        )}

        {/* Call to Action Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-purple-600">Get Started Today!</h3>
          <p className="text-gray-700 mb-4">Create an account to start managing your tasks more effectively.</p>
          <button
            onClick={() => navigate("/signup")}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Sign Up Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
