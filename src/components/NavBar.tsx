import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {  LogOut, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/app/providers/AuthProvider";
import { useNavigate } from "react-router-dom";



export default function NavBar() {
  
  const { logout,user } = useAuth();
  console.log("userrr",user);
  
  const navigate = useNavigate()

  return (
    <nav className="w-full bg-blue-600 text-white px-6  py-4 flex justify-between items-center shadow-md">
      {/* Left Section — User Info */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border-2 border-white">
          <AvatarImage
            src={
              // profileUrl ||
              "https://tse4.mm.bing.net/th/id/OIP.1GgC7tyMqK3jFKU7WIWu5gAAAA?pid=Api&P=0&h=180"
            }
          />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        <div className="flex flex-col leading-tight">
          <span className="font-semibold text-lg">Welcome {user?.name}</span>
          <span className="text-sm text-blue-100">{user?.role}</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

     

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-10 w-10 cursor-pointer border-2 border-white">
              <AvatarImage
                src={
           
                  "https://tse4.mm.bing.net/th/id/OIP.1GgC7tyMqK3jFKU7WIWu5gAAAA?pid=Api&P=0&h=180"
                }
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => navigate('/sales')} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Home
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
