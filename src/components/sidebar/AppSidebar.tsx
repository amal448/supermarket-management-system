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
    <Sidebar>
      <SidebarHeader className="">
        <img className="w-16 h-16" src="https://tse4.mm.bing.net/th/id/OIP.KU8XLoPgNlQxuaQXl9rrPwHaG9?pid=Api&P=0&h=180" alt="" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {items.map((item) => (
            <Link
              key={item.url}
              to={item.url}
              className="block px-4 py-2 hover:bg-accent rounded-md"
            >
              {item.title}
            </Link>
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  )
}
