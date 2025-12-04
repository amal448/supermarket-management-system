import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/app/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

interface NavBarProps {
  name?: string;
  role?: string;
  notifications?: number;
  profileUrl?: string;
}

export default function NavBar({
  name = "Amal",
  role = "Cashier",
  notifications = 3,
  profileUrl,
}: NavBarProps) {
 
  const { logout } = useAuth();
  const navigate = useNavigate()

  return (
    <nav className="w-full bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Left Section — User Info */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-white">
          <AvatarImage
            src={
              profileUrl ||
              "https://tse4.mm.bing.net/th/id/OIP.1GgC7tyMqK3jFKU7WIWu5gAAAA?pid=Api&P=0&h=180"
            }
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-lg">{name}</span>
          <span className="text-sm text-blue-100">{role}</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Notifications */}
        <div className="relative cursor-pointer">
          <Bell className="h-6 w-6" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {notifications}
            </span>
          )}
        </div>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-10 w-10 cursor-pointer border-2 border-white">
              <AvatarImage
                src={
                  profileUrl ||
                  "https://tse4.mm.bing.net/th/id/OIP.1GgC7tyMqK3jFKU7WIWu5gAAAA?pid=Api&P=0&h=180"
                }
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/sales-history')} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Transaction Details
            </DropdownMenuItem>

            <DropdownMenuItem onClick={logout} className="cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
