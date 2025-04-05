import { useState } from "react";
import { useAuth } from "./Authenticate"; // Import the useAuth hook
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

export default function Login() {
  const { login } = useAuth(); // Use the login function from context
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // Initialize the navigate function

  const handleLogin = async () => {
    try {
      await login(credentials); // Call the login function from context
      
      // If login is successful, redirect to the dashboard page
      navigate("/dashboard"); // Redirect to /dashboard
    } catch (error) {
      console.error(`Login failed: ${error}`);
      alert("Login failed!");
    }
  };
  const handleLogout = () => {
    logout()}

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
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}></button>
    </div>
  );
}
