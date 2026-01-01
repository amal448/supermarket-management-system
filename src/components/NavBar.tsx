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
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const avatarSrc = (user as any)?.profileUrl ?? (user as any)?.avatar ?? null;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";


  return (
    <nav className="w-full bg-blue-600 text-white px-4 py-2 flex items-center justify-between shadow-md min-h-14">
      {/* Left Section — User Info */}
      <div className="flex items-center gap-2">
        <Avatar className="h-7 w-7 border border-white/80">
          {avatarSrc ? (
            <AvatarImage src={avatarSrc} className="object-cover" />
          ) : (
            <AvatarFallback className="bg-white text-blue-700">
              <User className="h-4 w-4" aria-hidden />
            </AvatarFallback>
          )}
        </Avatar>

        <div className="hidden sm:flex flex-col leading-tight max-w-40">
          <span className="font-semibold text-sm truncate">Welcome {user?.name?.split(' ')[0]}</span>
          <span className="text-xs text-blue-200 truncate">{user?.role}</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Account menu">
            <Avatar className="h-7 w-7 cursor-pointer border border-white/80">
              {avatarSrc ? (
                <AvatarImage src={avatarSrc} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-white text-blue-700 font-semibold">{initials}</AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
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
