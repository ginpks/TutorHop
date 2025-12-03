import React, { createContext, useContext, useEffect, useMemo } from "react";

interface AuthProps {
  token?: string;
  children?: React.ReactNode;
  login?: any;
  logout?: any;
}
const AuthContext = createContext<AuthProps>({});
export const AuthProvider = ({ children, token }: AuthProps) => {
  const login = (token?: string) => {
    if (typeof token === "string") {
      localStorage.setItem("token", token);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
  };

  useEffect(() => {
    login(token);
  }, [token]);

  return (
    <AuthContext.Provider
      value={useMemo(() => ({ token, login, logout }), [token])}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
