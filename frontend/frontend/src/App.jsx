// App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./Components/Authenticate.jsx";
import PrivateRoute from "./Components/PrivateRoute"; // Import the PrivateRoute component
import Home from './Components/Home';
import Login from './Components/Login';
import Signup from './Components/Signup';
import AddTask from './Components/addTask';
import Dashboard from './Components/Dashboard';


function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          {/* none protectd route */}
          <Route
            path="/dashboard"
            element={
            
              <PrivateRoute>
              <Dashboard />
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
          
          {/* Protect the dashboard route */}
          {/* <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
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
          /> */}
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;