import { createContext, useState, useEffect, useContext } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 Add loading state


  // Login function (as you've already defined)
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
      console.log("Bare data",data)

      if (data.token) {
        localStorage.setItem("token", data.token);

        // Decode the token and set the user data
        const tokenParts = data.token.split(".");
        if (tokenParts.length === 3) {
          const userCred = JSON.parse(atob(tokenParts[1]));

          const userData = {
            username: userCred.name,
            role: userCred.role,
            email: userCred.email,
            permissions: Array.isArray(userCred.permissions)
              ? userCred.permissions
              : [userCred.permissions],
          };

          setUser(userData);
          console.log(userData)
          alert("Login successful!");

          
        }
      }
    } catch (error) {
      console.error("Error in login function:", error.message);
      throw error;
    }
  };

  // Logout function 
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
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
    try {
      const tokenParts = token.split(".");
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));

        const currentTime = Date.now() / 1000; // in seconds
        if (payload.exp && currentTime > payload.exp) {
          // Token is expired
          console.log("Token expired");
          localStorage.removeItem("token");
          setUser(null);
        } else {
          const userData = {
            username: payload.username,
            role: payload.role,
            email: payload.email,
            permissions: Array.isArray(payload.permissions)
              ? payload.permissions
              : [payload.permissions],
          };
          setUser(userData);

          // Auto logout when token expires
          if (payload.exp) {
            const timeUntilExpiry = (payload.exp * 1000) - Date.now(); // in ms
            setTimeout(() => {
              console.log("Auto-logging out due to token expiry");
              logout();
              alert("Session expired. Please log in again.");
            }, timeUntilExpiry);
          }
        }
      }
    } catch (error) {
      console.error("Error parsing token");
      localStorage.removeItem("token");
      setUser(null);
    }
  }
  setLoading(false);
}, []);

  return (
    <UserContext.Provider value={{ user, login, logout, loading, signup }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
};


// import { createContext, useState, useEffect, useContext } from "react";

// export const userContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);


//   const login = async (credentials) => {
//     try {
//       const response = await fetch(`http://localhost:2173/api/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(credentials),
//       });
  
//       if (!response.ok) {
//         throw new Error(`Login failed with status ${response.status}`);
//       }
  
//       const data = await response.json();
  
//       if (data.token) {
//         localStorage.setItem("token", data.token);
        
//         // Safely decode the token
//         try {
//           const userCred = JSON.parse(atob(data.token.split(".")[1]));
//           const userData = {
//             username: userCred.name,
//             role: userCred.role,
//             email:userCred.email,
//             // Ensure permissions is always treated as an array
//             permissions: Array.isArray(userCred.permissions) 
//               ? userCred.permissions 
//               : [userCred.permissions]
//           };
//           console.log("User decoded from token:", userData);
//           setUser(userData);

//           if (user != null){
//             alert("Login successful!");
//           }
//         } catch (parseError) {
//           console.error("Error parsing token:", parseError);
//           throw new Error("Invalid token format");
//         }
//       }
//     } catch (error) {
//       console.error("Error in login function:", error.message);
//       throw error;
//     }
//   };  

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     console.log(user)
//   };

  // const signup = async (credentials) => {
  //   let response = await fetch(`http://localhost:2173/api/signup`, {
  //     method: 'POST',
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(credentials)  
  //   })

  //   return response.json();
  // };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       const userCred = JSON.parse(atob(token.split(".")[1]));
//       console.log("Authenticate: user creds are: ");

//       console.log(userCred.permissions);
//       setUser({
//         username: userCred.username,
//         role: userCred.role,
//         email: userCred.email,
//         permissions: userCred.permissions,
//       });
//     }
//   }, []);

//   return (
//     <userContext.Provider value={{ user, login, logout, signup }}>
//       {children}
//     </userContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(userContext);
//   if (!context) {
//     throw new Error('useAuth must be used within a UserProvider');
//   }
//   return context;
// };