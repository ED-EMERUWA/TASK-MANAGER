// App.jsx or main component
import { UserProvider } from './Components/Authenticate';
import Login from './Components/Login';
import Signup from './Components/Signup';
import AddTask from './Components/addTask';
import Dashboard from './Components/DashBoard';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Components/layout';
import Home from './Components/home';


function App() {
  return (

    <UserProvider>
      <Router>
        <Routes>  
          <Route element={<Layout/>}>
            
        <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add-task" element={<AddTask />} />
          <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>


  );
}

export default App;