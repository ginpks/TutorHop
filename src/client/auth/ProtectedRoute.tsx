import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { accessToken, loading } = useAuth();

  if (loading) return null; // or loading spinner

  if (!accessToken) return <Navigate to="/login" replace />;

  return children;
}

