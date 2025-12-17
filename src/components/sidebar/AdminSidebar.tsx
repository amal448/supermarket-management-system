// import { commonItems } from "./CommonItems";
import { AppSidebar } from "./AppSidebar";

const adminItems = [
  { title: "DashBoard", url: "" },
  { title: "Stock Management", url: "view-stocks" },
  // ...commonItems,
  { title: "Product Management", url: "products" },
  { title: "All Branches", url: "branches" },
  { title: "Managers", url: "managers" },
  { title: "Chat", url: "conversation" },
  { title: "Discount Management", url: "discount" },
];

export default function AdminSidebar() {
  return <AppSidebar items={adminItems} />;
}
