// App.jsx or main component
import { UserProvider } from './Components/Authenticate';
import Login from './Components/Login';
import Signup from './Components/Signup';

function App() {
  return (
    <UserProvider>
      <Login />
      <Signup />
      {/* Other components */}
    </UserProvider>
  );
}

export default App;