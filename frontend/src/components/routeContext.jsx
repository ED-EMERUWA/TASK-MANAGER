import { createContext, useState, useEffect, useContext } from "react";

export const routeContext = createContext();

export const UserProvider = ({ children }) => {
  const [backendRoute, setbackendRoute] = useState("https://task-flow-backend-bc30.onrender.com");
  const altROute ="http://localhost:2173"
  