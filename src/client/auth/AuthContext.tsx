import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

axios.defaults.withCredentials = true;

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const res = await axios.post("http://localhost:3001/refresh_token");
      if (res.data.accessToken) {
        setAccessToken(res.data.accessToken);
      }
    } catch {
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  }

  // refresh token on first load
  useEffect(() => {
    refresh();
  }, []);

  // auto-refresh every 14 minutes (for 15m tokens)
  useEffect(() => {
    if (!accessToken) return;

    const { exp } = jwtDecode<{ exp: number }>(accessToken);
    const delay = exp * 1000 - Date.now() - 30_000; // 30s early

    if (delay <= 0) {
      refresh();
      return;
    }

    const id = setTimeout(refresh, delay);
    return () => clearTimeout(id);
  }, [accessToken]);

  const logout = () => {
    setAccessToken(null);
    axios.post("http://localhost:3001/logout"); // optional backend route
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

