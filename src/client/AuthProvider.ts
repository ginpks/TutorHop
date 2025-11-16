import { createContext, useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext(null);

axios.defaults.withCredentials = true; // sends cookie automatically

export default function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState("");

  async function refresh() {
    const res = await axios.post("/refresh_token");
    if (res.data.accessToken) {
      setAccessToken(res.data.accessToken);
    }
  }

  // get token when page loads
  useEffect(() => {
    refresh();
  }, []);

  // auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (accessToken) {
        const { exp } = jwtDecode(accessToken);
        if (Date.now() >= exp * 1000 - 30_000) {
          refresh();
        }
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

