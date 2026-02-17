/**
 * AuthContext manages the user's authentication state by storing a token,
 * It provides functions for the user to register, log in, and log out,
 * all of which update the token in state.
 */

import { createContext, useContext, useState } from "react";

// import.meta.env allows us to access environment variables,
// which are defined in a file named .env
const API = import.meta.env.VITE_API;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  const register = async (username, password) => {
    const response = await fetch(API + "/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
        username,
        password,
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw Error(result.message || "Registration failed");
    }
    setToken(result.token);
    localStorage.setItem("token", result.token);
  };

  const login = async (username, password) => {
    const response = await fetch(API + "/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw Error(result.message || "Login failed");
    }
    setToken(result.token);
    localStorage.setItem("token", result.token);
  };

 const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = { token, register, login, logout };
  return (
  <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within AuthProvider");
  return context;
}
