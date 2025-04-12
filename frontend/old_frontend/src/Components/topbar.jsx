
import { Home, PlusCircle, LogIn, UserPlus } from "lucide-react"
import { useAuth } from "../Components/Authenticate"

function Sidebar({ onNavigate, activePage }) {
  const { user, logout } = useAuth()

  return (
    <div className="h-screen w-64 bg-slate-800 text-white flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold">Task Manager</h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <SidebarItem
            icon={<Home size={20} />}
            label="Dashboard"
            id="dashboard"
            isActive={activePage === "dashboard"}
            onClick={() => onNavigate("dashboard")}
          />
          <SidebarItem
            icon={<PlusCircle size={20} />}
            label="Add Task"
            id="addTask"
            isActive={activePage === "addTask"}
            onClick={() => onNavigate("addTask")}
          />

          {!user && (
            <>
              <SidebarItem
                icon={<LogIn size={20} />}
                label="Login"
                id="login"
                isActive={activePage === "login"}
                onClick={() => onNavigate("login")}
              />
              <SidebarItem
                icon={<UserPlus size={20} />}
                label="Signup"
                id="signup"
                isActive={activePage === "signup"}
                onClick={() => onNavigate("signup")}
              />
            </>
          )}
        </ul>
      </nav>

      {user && (
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
              {user.username ? user.username.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <p className="text-sm font-medium">{user.username || "User"}</p>
              <p className="text-xs text-slate-400">{user.email || ""}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full mt-2 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

function SidebarItem({ icon, label, id, isActive, onClick }) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center w-full p-2 rounded-md transition-colors ${
          isActive ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-700 hover:text-white"
        }`}
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </button>
    </li>
  )
}

export default Sidebar

