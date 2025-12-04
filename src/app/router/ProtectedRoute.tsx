import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";

type Props = {
  allowedRoles: string[];
};

export default function ProtectedRoute({ allowedRoles }: Props) {
  
  const { user, initialized  } = useAuth();
  
  if (!initialized ) return <div>Loading...</div>;

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // nested routes
}
