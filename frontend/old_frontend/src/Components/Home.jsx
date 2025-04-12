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
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-4 text-purple-700">
          Welcome, {user ? user.username : "Guest"}!
        </h1>

        {user ? (
          <>
            <p className="text-gray-700 mb-2">Email: {user.email}</p>
            <p className="text-gray-700 mb-2">Role: {user.role}</p>
            <p className="text-gray-700 mb-6">
              Permissions: {user.permissions.join(", ")}
            </p>
            <button
              onClick={logout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-700 mb-4">Please log in to continue.</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
