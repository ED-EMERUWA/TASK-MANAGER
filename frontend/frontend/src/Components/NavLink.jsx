import { Link } from "react-router-dom"

function NavLink({ href, icon, label, active }) {
  return (
    <Link
      to={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
        ${
          active
            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
            : "text-gray-300 hover:text-white hover:bg-gray-800"
        }
      `}
    >
      <span className={`flex-shrink-0 ${active ? "text-cyan-400" : "text-gray-400"}`}>{icon}</span>
      <span>{label}</span>
      {active && <span className="absolute inset-0 rounded-md bg-cyan-500/5 pointer-events-none"></span>}
    </Link>
  )
}

export default NavLink

