import { createContext, useState, useEffect, useContext } from "react";

export const userContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);


  const login = async (credentials) => {
    try {
      const response = await fetch(`http://localhost:2173/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        throw new Error(`Login failed with status ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.token) {
        localStorage.setItem("token", data.token);
        
        // Safely decode the token
        try {
          const userCred = JSON.parse(atob(data.token.split(".")[1]));
          const userData = {
            username: userCred.name,
            role: userCred.role,
            email:userCred.email,
            // Ensure permissions is always treated as an array
            permissions: Array.isArray(userCred.permissions) 
              ? userCred.permissions 
              : [userCred.permissions]
          };
          console.log("User decoded from token:", userData);
          setUser(userData);

          if (user != null){
            alert("Login successful!");
          }
        } catch (parseError) {
          console.error("Error parsing token:", parseError);
          throw new Error("Invalid token format");
        }
      }
    } catch (error) {
      console.error("Error in login function:", error.message);
      throw error;
    }
  };  

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    console.log(user)
  };

  const signup = async (credentials) => {
    let response = await fetch(`http://localhost:2173/api/signup`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)  
    })

    return response.json();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userCred = JSON.parse(atob(token.split(".")[1]));
      console.log("Authenticate: user creds are: ");

      console.log(userCred.permissions);
      setUser({
        username: userCred.username,
        role: userCred.role,
        email: userCred.email,
        permissions: userCred.permissions,
      });
    }
  }, []);

  return (
    <userContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </userContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error('useAuth must be used within a UserProvider');
  }
  return context;
};