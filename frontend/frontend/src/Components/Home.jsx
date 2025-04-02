import { Link } from "react-router-dom";

import React from "react";
import { useAuth } from "./Authenticate.jsx"; // Adjust the import path accordingly

const Home = () => {
  const { user, logout } = useAuth(); // Destructure user and logout

  return (
    <div>
      <h1>Welcome, {user ? user.username : "Guest"}!</h1>
      {user ? (
        <>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
          <p>Permissions: {user.permissions.join(", ")}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  );
};

export default Home;

