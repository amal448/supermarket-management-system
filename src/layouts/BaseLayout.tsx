import NavBar from "@/components/NavBar";
import { Outlet } from "react-router-dom";

export default function BaseLayout() {
  return (
    <div className="h-screen ">
      {/* Sidebar injected by child */}
      <NavBar/>
      <div className="h-full px-6 md:px-16 mb-10 lg:px-24 py-5 overflow-hidden">
      <Outlet />
      </div>
    </div>
  );
}
