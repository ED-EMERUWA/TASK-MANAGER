import { useState, useEffect } from "react";
import { useAuth } from "./Authenticate";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, user } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(credentials);
      navigate("/dashboard");
    } catch (error) {
      console.error(`Login failed: ${error}`);
      alert("Login failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">Login</h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none text-gray-900" // Added text color
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none text-gray-900" // Added text color
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Don't have an account?</p>
          <button
            onClick={() => navigate("/signup")}
            className="text-purple-600 hover:underline mt-1"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
