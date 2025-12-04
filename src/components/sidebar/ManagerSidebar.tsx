import { AppSidebar } from "./AppSidebar";
import { commonItems } from "./CommonItems";

const managerItems = [
  { title: "Dashboard", url: "dashboard" },
  { title: "Product Catalog", url: "products" },
  { title: "Stock Management", url: "stocks" },
  { title: "Staff Management", url: "staff-management" },
  ...commonItems,
  { title: "Sales Reports", url: "branch-sales" },
];

export default function ManagerSidebar() {
  return <AppSidebar items={managerItems} />;
}
