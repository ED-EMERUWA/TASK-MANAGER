import { useContext, useState } from "react";
import { userContext } from "./Authenticate"; // Adjust the path
import { useAuth } from "./Authenticate"; // Updated import

export default function Login() {
  const { login, logout } = useAuth(); // Use the new hook
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    try {
      await login(credentials);
      
      
    } catch (error) {
      console.error(`Login failed: ${error}`);
      alert("Login failed!");
    }
  };

  const handleLogout = () => {
    logout()
    
  }

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
