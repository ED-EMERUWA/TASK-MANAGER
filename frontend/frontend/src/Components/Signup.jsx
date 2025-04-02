import { useEffect, useState } from "react";
import { useAuth } from "./Authenticate";
import { useNavigate} from "react-router-dom";

export default function Signup() {
//   const navigate = useNavigate();
// Using signup function from my authenticate
  const { signup } = useAuth(); // Use the new hook
  const [token, setToken] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: ""
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    console.log(storedToken);
    if (!storedToken) {
      console.log("No one is logged in");
    } else {
      console.log("Existing token:", storedToken);
    }
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
        await signup(formData)
        console.log("Signup data submitted on the front end:", formData);
      } catch (error) {
        console.error(`Signup failed: ${error}`);
        alert("Sign up failed!");
      }
  
    
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Join Us</h2>
      {token ? (
        <p>You're already logged in!</p>
      ) : (
        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            style={{ padding: "8px" }}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            style={{ padding: "8px" }}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{ padding: "8px" }}
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            style={{ padding: "8px" }}
          >
            <option value="">Select Role</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={{ padding: "8px" }}
          />
          <button 
            type="submit" 
            style={{ 
              padding: "10px", 
              backgroundColor: "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer" 
            }}
          >
            Sign Up
          </button>
          <button 
            type="button" 
            // onClick={() => navigate('/login')}
            style={{ 
              padding: "10px", 
              backgroundColor: "#6c757d", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            Already have an account? Login
          </button>
        </form>
      )}
    </div>
  );
}