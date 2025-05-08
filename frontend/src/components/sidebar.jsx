// components/Sidebar.jsx
import { LogOut, Layers, User, PlusCircle, CheckSquare, List } from "lucide-react";
import { useAuth } from "./Authenticate";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigateAndCloseSidebar = (path) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const baseMenu = [
    { name: "Dashboard", icon: <Layers size={18} />, path: "/dashboard" },
    { name: "Profile", icon: <User size={18} />, path: "/profile" },
  ];

  const roleBasedMenu = {
    admin: [
    { name: "Assigned Tasks", icon: <List size={18} />, path: "/assigned-tasks" },
      { name: "Add Task", icon: <PlusCircle size={18} />, path: "/add-task" },
      { name: "Completed Tasks", icon: <CheckSquare size={18} />, path: "/completed" }
    ],
    teacher: [
     
      { name: "Completed Tasks", icon: <CheckSquare size={18} />, path: "/completed" },
    ],
  };

  const menuItems = [...baseMenu, ...(roleBasedMenu[user?.role?.name] || [])];

  return (
    <div
      className={`
        fixed md:static inset-y-0 left-0 w-64 bg-gray-800 border-r border-gray-700
        transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300 ease-in-out
        overflow-y-auto z-30 md:h-screen
      `}
    >
      <div className="hidden md:block p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Task Flow</h1>
      </div>

      <div className="flex justify-end p-4 md:hidden">
        <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-md bg-gray-700 hover:bg-gray-600">
          <span className="sr-only">Close menu</span>✖
        </button>
      </div>

      <div className="px-4 py-2">
        <div className="bg-gray-700/50 rounded-md p-3 mb-6">
          <p className="text-sm text-gray-400">Signed in as</p>
          <p className="truncate font-medium">{user?.email}</p>
        </div>
      </div>

      <nav className="px-3 pb-10">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigateAndCloseSidebar(item.path)}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${
                  item.path === location.pathname
                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400"
                    : "hover:bg-gray-700/70 text-gray-300"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-800">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md transition duration-200"
        >
          <span> Logout</span>
        </button>
      </div>
    </div>
  );
}
