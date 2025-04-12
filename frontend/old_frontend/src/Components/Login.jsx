import { useState, useEffect } from "react";
import { useAuth } from "./Authenticate"; // Import the useAuth hook
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

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
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <div>
        <p>Don't have an account?</p>
        <a onClick={() => navigate("/signup")}>Sign up</a>
      </div>
    </div>
  );
}
