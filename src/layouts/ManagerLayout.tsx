import { Outlet } from "react-router-dom";
import ManagerSidebar from "@/components/sidebar/ManagerSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"; // IMPORTANT
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/providers/AuthProvider";

export default function ManagerLayout() {
  const { logout, user } = useAuth();
  console.log("usermananana", user?.id!);


  return (
    <SidebarProvider>
      <ManagerSidebar />
      <main className="w-full">
        <nav className="w-full bg-gray-100 py-2 px-4 ">
          <div className="flex justify-between items-center">
            <div className="space-x-5">
              <SidebarTrigger />
              <span className="uppercase font-semibold ">Welcome {user?.name} 🎉</span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notification Icon */}
            

              {/* Logout Button */}
              <Button onClick={logout} className="uppercase font-bold cursor-pointer hover:bg-green-400 hover:text-white" variant="outline">LogOut</Button>
            </div>
          </div>
        </nav>
        <div className="px-4 py-4 md:py-8 ">
          <Outlet /> {/* This renders child routes like dashboard, branches */}
        </div>
      </main>
    </SidebarProvider>
  );
}
