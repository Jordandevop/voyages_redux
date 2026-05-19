/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("connectedUser");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const login = (userData, accessToken) => {
    
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("connectedUser", JSON.stringify(userData));
    localStorage.setItem("token", accessToken);
  };

  const logout = () => {
    localStorage.removeItem("connectedUser");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(){
    return useContext(AuthContext)
}

export default AuthContext;