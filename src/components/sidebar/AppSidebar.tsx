import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

type SidebarItem = {
  title: string
  url: string
}

export function AppSidebar({ items = [] }: { items?: SidebarItem[] }) {
  return (
    <Sidebar className="bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo / Header */}
      <SidebarHeader className="flex items-center justify-center h-20 border-b border-gray-200">
        <img
          className="w-14 h-14 rounded-full"
          src="https://tse4.mm.bing.net/th/id/OIP.KU8XLoPgNlQxuaQXl9rrPwHaG9?pid=Api&P=0&h=180"
          alt="Logo"
        />
      </SidebarHeader>

      {/* Menu Items */}
      <SidebarContent className="flex-1 overflow-y-auto py-4">
        <SidebarGroup>
          {items.map((item) => {
            const isActive = location.pathname === item.url;

            return (
              <Link
                key={item.url}
                to={item.url}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-md mb-1
                  ${isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100"}
                  transition-colors duration-200
                `}
              >
                {/* {item.icon && <span className="flex-shrink-0">{item.icon}</span>} */}
                <span className="font-medium">{item.title}</span>
              </Link>
            );
          })}
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-t border-gray-200 text-gray-500 text-sm">
        &copy; 2025 Your Company
      </SidebarFooter>
    </Sidebar>
  )
}
