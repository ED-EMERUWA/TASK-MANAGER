import { useState, useEffect } from "react";
import { useAuth } from "./Authenticate";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png"; // correct "assets" spelling


export default function Login() {
  const { login, user, logout } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login(credentials);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password.");
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
    <>
      {/* Navbar */}
      <nav className="fixed w-full backdrop-blur-md bg-black/70 z-50 px-6 py-4 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg" />

              <span className="font-bold text-xl text-white">TaskFlow</span>
            </a>
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
                  className="px-4 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 rounded-full font-medium transition-colors text-black"
                >
                  Get Started
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-full font-medium transition-colors text-white"
              >
                Dashboard
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-10 sm:py-20 pt-28">
        <div className="w-full max-w-md bg-[#222222] rounded-2xl shadow-lg p-8 sm:p-10">
          <h2 className="text-3xl font-bold text-[#1DCD9F] mb-3 text-center">
            Log in
          </h2>
          <p className="text-gray-400 text-center mb-6">
            Sign in to your account to continue
          </p>

          {error && (
            <div className="border text-red-700 text-sm rounded-xl px-4 py-3 mb-5 text-center">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-600 bg-[#111111] rounded-xl focus:ring-2 focus:ring-[#1DCD9F] outline-none text-white placeholder-gray-400"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-600 bg-[#111111] rounded-xl focus:ring-2 focus:ring-[#1DCD9F] outline-none text-white placeholder-gray-400"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#1DCD9F] text-black font-semibold py-3 rounded-xl hover:bg-[#169976] transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <div className="text-sm text-center text-gray-400 mt-8">
            <span>Don't have an account?</span>
            <button
              onClick={() => navigate("/signup")}
              className="ml-1 text-[#1DCD9F] hover:underline font-medium"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
