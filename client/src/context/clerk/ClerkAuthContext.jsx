import React, { createContext, useState, useEffect } from "react";

export const ClerkAuthContext = createContext();

export function ClerkAuthProvider({ children }) {
  const [clerk, setClerk] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setClerk({ name: "John Doe", role: "clerk" });
    } else {
      setClerk(null);
    }
  }, []);

  const logout = () => {
    setClerk(null);
    localStorage.removeItem("token");
  };

  return (
    <ClerkAuthContext.Provider value={{ clerk, logout }}>
      {children}
    </ClerkAuthContext.Provider>
  );
}