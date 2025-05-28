import { useState, useEffect } from "react";
import { context } from "./context.js";

const Provider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [userId, setUserId] = useState(() => {
    const stored = localStorage.getItem("userId");
    return stored ? parseInt(stored, 10) : "";
  });

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    if (userId !== "") {
      localStorage.setItem("userId", userId.toString());
    } else {
      localStorage.removeItem("userId");
    }
  }, [userId]);

  return (
    <context.Provider value={{ isLoggedIn, setIsLoggedIn, userId, setUserId }}>
      {children}
    </context.Provider>
  );
};

export default Provider;