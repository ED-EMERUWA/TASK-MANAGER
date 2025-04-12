// Components/Signup.jsx
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-purple-700 mb-6">Join Us</h2>

        <form
          onSubmit={handleSignup}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
          />
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
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
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
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
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800"
          />

          <button
            type="submit"
            disabled={loading} // ✅ Disable during loading
            className={`p-3 text-white font-semibold rounded-lg transition duration-300 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="p-3 text-purple-600 font-semibold border border-purple-600 rounded-lg hover:bg-purple-100 mt-4"
          >
            Already have an account? Login
          </button>
        </form>
      </div>
    </div>
  );
}
