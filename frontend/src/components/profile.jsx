import { useEffect, useState } from "react";
import { useAuth } from "./Authenticate.jsx";
import { useNavigate } from "react-router-dom";
import { 
  Menu, X, LogOut, Layers, User, PlusCircle, 
  CheckSquare, List 
} from "lucide-react";
import Sidebar from "./sidebar.jsx";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) return (
    <p className="text-center mt-10 text-gray-400 bg-gray-900 min-h-screen flex items-center justify-center">
      No user data available.
    </p>
  );

  const menuItems = [
    { name: "Dashboard", icon: <Layers size={18} />, path: "/dashboard" },
    { name: "Profile", icon: <User size={18} />, path: "/profile" },
    { name: "Add Task", icon: <PlusCircle size={18} />, path: "/add-task" },
    { name: "Completed Tasks", icon: <CheckSquare size={18} />, path: "/completed" },
    { name: "Assigned Tasks", icon: <List size={18} />, path: "/assigned-tasks" }
  ];

  const navigateAndCloseSidebar = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
     <div className="flex flex-col min-h-screen bg-gray-900 text-white md:flex-row">
      {/* Mobile header */}
      <header className="sticky top-0 z-20 bg-gray-800 md:hidden flex items-center justify-between p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">
          <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Task Flow</span>
        </h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white transition-colors"
        >
          <Menu size={24} />
        </button>
      </header>
    
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    
    <main className="flex-1 p-4 md:p-8 pt-4">
          
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 md:p-6 shadow-xl text-center">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
              Profile
            </h1>

            {/* Avatar Circle */}
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 flex items-center justify-center rounded-full bg-emerald-600 text-white text-3xl md:text-4xl font-semibold shadow-md">
              {(user.username?.[0] || "U").toUpperCase()}
            </div>

            {/* User Info */}
            <div className="space-y-4 text-gray-300 text-lg text-left px-4">
              <p><strong>Name:</strong> {user.username || "Unknown"}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role?.name || "User"}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );s
}
