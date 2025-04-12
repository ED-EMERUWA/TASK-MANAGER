// components/Header.jsx
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-purple-800 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/" className="hover:text-purple-300">Task flows</Link>
        </h1>
        <nav className="space-x-6">
          
        
        </nav>
      </div>
    </header>
  );
}
