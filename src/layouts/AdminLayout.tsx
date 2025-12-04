import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/sidebar/AdminSidebar";
import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";

export default function AdminLayout() {
  const {  logout } = useAuth();

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full">
        <nav className="w-full bg-gray-100 py-2 px-4 ">
          <div className="flex justify-between items-center">
            <div>
              <SidebarTrigger />
              <span>Welcome User</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notification Icon */}
              <button className="relative">
                <Bell className="h-6 w-6 text-gray-700" />
                {/* Optional: badge */}
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
              </button>

              {/* Logout Button */}
              <Button onClick={logout} variant="outline">LogOut</Button>
            </div>
          </div>
        </nav>
        <div className="px-4 py-4">
          <Outlet /> {/* This renders child routes like dashboard, branches */}
        </div>
      </main>
    </SidebarProvider>
  );
}
