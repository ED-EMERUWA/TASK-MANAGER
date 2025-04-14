import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./components/Authenticate.jsx";
import PrivateRoute  from "./components/PrivateRoute"; // Import the PrivateRoute component
// import Header from "./Components/Header"; // Import the Header component
import Home from "../src/components/Home.jsx";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AddTask from "./components/addTask.jsx";
import CompletedTasks from "./components/completedTasks.jsx";
import Profile from "./components/profile.jsx";
import AssignedTasks from "./components/assignedTasks.jsx"; // The AssignedTasks component
import Contact from "./components/Contact.jsx";

import Dashboard from "./components/Dashboards.jsx";
// import About from "./components/About.jsx";


function App() {
  return (
    <UserProvider>
      <Router>
        {/* Add the Header here, so it appears on all pages */}
        {/* <Header /> */}

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Home />} />
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/contact" element={<Contact />} />
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/assigned-tasks"
            element={
              <PrivateRoute>
                <AssignedTasks />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-task"
            element={
              <PrivateRoute>
                <AddTask />
              </PrivateRoute>
            }
          />
          <Route
            path="/completed"
            element={
              <PrivateRoute>
                <CompletedTasks />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
