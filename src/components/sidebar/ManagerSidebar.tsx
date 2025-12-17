import { AppSidebar } from "./AppSidebar";

const managerItems = [
  { title: "Dashboard", url: "dashboard" },
  { title: "Sale Analysis", url: "sale-analysis" },
  { title: "Chat/Notification", url: "conversation" },
  { title: "Product Catalog", url: "products" },
  { title: "Stock Management", url: "stocks" },
  { title: "Staff Management", url: "staff-management" },
  { title: "Sales Reports", url: "branch-sales" },
];

export default function ManagerSidebar() {
  return <AppSidebar items={managerItems} />;
}
