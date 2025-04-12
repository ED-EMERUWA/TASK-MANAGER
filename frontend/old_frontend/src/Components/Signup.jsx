import { useEffect, useState } from "react";
import { useAuth } from "./Authenticate";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [orgs, setOrgs] = useState([]);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Added loading state

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
    userOrg: "",
  });

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const response = await fetch("http://localhost:2173/api/orgs", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`Failed to get organizations: ${response.status}`);
        }

        const data = await response.json();
        setOrgs(data);
      } catch (error) {
        console.error("Error fetching orgs:", error);
      }
    };

    fetchOrgs();
  }, []);

  // ✅ Safe redirect after successful signup
  useEffect(() => {
    if (signedIn) {
      navigate("/login");
    }
  }, [signedIn, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Start loading
    try {
      await signup(formData);
      setSignedIn(true); // ✅ Triggers redirect in the effect above
    } catch (error) {
      console.error(`Signup failed: ${error}`);
      alert("Sign up failed!");
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Join Us</h2>
      <form
        onSubmit={handleSignup}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          style={{ padding: "8px" }}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          style={{ padding: "8px" }}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          style={{ padding: "8px" }}
        />
        <select
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value })
          }
          style={{ padding: "8px" }}
        >
          <option value="">Select Role</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={formData.userOrg}
          onChange={(e) =>
            setFormData({ ...formData, userOrg: e.target.value })
          }
          style={{ padding: "8px" }}
        >
          <option value="">Select Organization</option>
          {orgs.map((org) => (
            <option key={org.id} value={org.id}>
              {org.name}
            </option>
          ))}
        </select>

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          style={{ padding: "8px" }}
        />

        <button
          type="submit"
          disabled={loading} // ✅ Disable during loading
          style={{
            padding: "10px",
            backgroundColor: loading ? "#6c757d" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          style={{
            padding: "10px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
}
