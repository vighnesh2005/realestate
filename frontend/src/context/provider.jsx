import { useState, useEffect } from "react";
import {context} from "./context.js";

const Provider = ({ children }) => {
const [isLoggedIn, setIsLoggedIn] = useState(() => {
  return localStorage.getItem("isLoggedIn") === "true";
});


  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("userId") || "";
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("userId", userId);
  }, [userId]);

  return (
    <context.Provider value={{ isLoggedIn, setIsLoggedIn, userId, setUserId }}>
      {children}
    </context.Provider>
  );
}; 

export default Provider;
         