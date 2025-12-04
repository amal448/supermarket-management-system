import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";

export default function GuestRoute() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // still initializing

  // If user is logged in, redirect based on role
  if (user) {
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "manager") return <Navigate to="/manager/dashboard" replace />;
    return <Navigate to="/sales" replace />; // default
  }

  // Otherwise, show the login page
  return <Outlet />;
}
