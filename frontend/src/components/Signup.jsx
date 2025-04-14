import { useEffect, useState } from "react";
import { useAuth } from "./Authenticate";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // correct "assets" spelling


export default function Signup() {
  const { signup, user, logout } = useAuth();
  const navigate = useNavigate();

  const [orgs, setOrgs] = useState([]);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");



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
        const response = await fetch("https://task-flow-backend-bc30.onrender.com/api/orgs");
        if (!response.ok) {
          throw new Error(`Failed to get organizations: ${response.status}`);
        }
        const data = await response.json();
        setOrgs(data);
      } catch (err) {
        console.error("Error fetching orgs:", err);
        setError("Failed to load organizations.");
      }
    };
    fetchOrgs();
  }, []);

  useEffect(() => {
    if (signedIn) {
      navigate("/login");
    }
  }, [signedIn, navigate]);

  const validateForm = () => {
    const { firstName, lastName, password, role, userOrg } = formData;
  
    if (firstName.trim().length < 2) {
      return "First name must be at least 2 characters.";
    }
    if (lastName.trim().length < 2) {
      return "Last name must be at least 2 characters.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character.";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number.";
    }
    if (password !== confirmPassword) {
      return "Passwords do not match.";
    }
    if (!role) {
      return "Please select a role.";
    }
    if (!userOrg) {
      return "Please select an organization.";
    }
  
    return null;
  };
  
  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
  if (validationError) {
    setError(validationError);
    window.scrollTo(0, 0); // Scroll to top on validation error
    return;
  }

    setLoading(true);
    try {
      await signup(formData);
      setSignedIn(true);
    } catch (err) {
      console.error("Signup failed:", err);
      setError("Signup failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* === Navbar === */}
      <nav className="fixed w-full backdrop-blur-md bg-black/70 z-50 px-6 py-4 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg" />
            <a href="/" className="font-bold text-xl text-white">TaskFlow</a>
          </div>
          <div className="hidden md:flex items-center gap-8 text-gray-300 text-sm">
            <a href="#features" className="hover:text-emerald-400 transition">Features</a>
            <a href="#testimonials" className="hover:text-emerald-400 transition">Testimonials</a>
            <a href="#faq" className="hover:text-emerald-400 transition">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm hover:text-emerald-400 transition-colors text-white"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 rounded-full font-medium transition-colors"
                >
                  Get Started
                </button>
              </>
            ) : (
              <button
                onClick={logout}
                className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-full font-medium transition-colors text-white"
              >
                Dashboard
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* === Signup Form === */}
      <div className="min-h-screen flex items-center justify-center bg-black px-4 py-12 sm:py-20 pt-32">
        <div className="w-full max-w-lg bg-[#222222] rounded-2xl p-8 sm:p-10 shadow-lg">
          <h2 className="text-3xl font-bold text-[#1DCD9F] mb-3 text-center">Create an Account</h2>
          <p className="text-gray-400 text-center mb-6">Join us and get started</p>

          {error && (
            <div className="text-red-400 text-m rounded-lg px-4 py-3 mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <input
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1DCD9F] outline-none"
            />

            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1DCD9F] outline-none"
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1DCD9F] outline-none"
            />

            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#1DCD9F] outline-none"
            >
              <option value="">Select Role</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>

            <select
              value={formData.userOrg}
              onChange={(e) => setFormData({ ...formData, userOrg: e.target.value })}
              className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-[#1DCD9F] outline-none"
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
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1DCD9F] outline-none"
            />

<input
  type="password"
  placeholder="Confirm Password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  className="w-full px-4 py-3 bg-[#111111] border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#1DCD9F] outline-none"
/>


            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-semibold rounded-xl transition duration-300 ${
                loading
                  ? "bg-gray-400 text-black cursor-not-allowed"
                  : "bg-[#1DCD9F] hover:bg-[#169976] text-black"
              }`}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full py-3 mt-4 border border-[#1DCD9F] text-[#1DCD9F] rounded-xl hover:bg-[#1dcd9f1a] transition"
            >
              Already have an account? Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
