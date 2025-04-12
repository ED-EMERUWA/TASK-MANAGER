import { Navigate } from "react-router-dom";
import { useAuth } from "./Authenticate"; // Import your custom hook

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Include `loading` from context

  if (loading) {
    // While checking auth status, don't render anything yet
    return <div>Loading...</div>; // Or show a spinner if you want
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
