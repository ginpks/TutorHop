import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  token?: string;
  logIn?: boolean;
  login?: (token?: string) => void;
  logout?: () => void;
  allowed: boolean;
}

interface AuthProviderProps {
  token?: string;
  children?: React.ReactNode;
  logIn?: boolean;
}

const AuthContext = createContext<AuthContextType>({ allowed: false });

export const AuthProvider = ({ children, token, logIn }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);

  const login = useCallback((t?: string) => {
    if (typeof t === "string") {
      localStorage.setItem("token", t);
    }
    setAllowed(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setAllowed(false);
  }, []);

  useEffect(() => {
    if (logIn === true) {
      login(token);
      return;
    }
    if (logIn === false) {
      logout();
      navigate("/");
      return;
    }
    const stored = localStorage.getItem("token");
    if (stored) {
      setAllowed(true);
    } else {
      setAllowed(false);
      navigate("/");
    }
  }, [token, logIn, login, logout, navigate]);

  const value = useMemo(
    () => ({ token, logIn, login, logout, allowed }),
    [token, logIn, login, logout, allowed],
  );

  if (!allowed) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
