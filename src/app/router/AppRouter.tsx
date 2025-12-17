import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "@/pages/common/LoginPage";
import AdminLayout from "@/layouts/AdminLayout";
import ManagerLayout from "@/layouts/ManagerLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import { Branches } from "@/pages/admin/Branches";
import ManagerDashboard from "@/pages/manager/ManagerDashboard";
import Inventory from "@/pages/admin/Inventory";
import GuestRoute from "./GuestRoute ";
import Managers from "@/pages/admin/Managers";
import Stock from "@/pages/manager/Stock";
import ViewInventory from "@/pages/manager/ViewInventory";
import ViewStockRequest from "@/pages/admin/ViewStockRequest";
import ViewStockDetail from "@/pages/admin/StockRequestDetail";
import StaffManagement from "@/pages/manager/StaffManagement";
import BaseLayout from "@/layouts/BaseLayout";
import CheckOutPage from "@/pages/common/CheckOutPage";
import Discount from "@/pages/admin/Discount";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCancel from "@/pages/PaymentCancel";
import HistoryPage from "@/pages/common/HistoryPage";
import BranchSales from "@/pages/manager/BranchSales";
import TransactionDetails from "@/pages/manager/TransactionDetails";
import BranchSaleAnalysis from "@/pages/manager/BranchSaleAnalysis";
import MessageBroadCast from "@/pages/admin/MessageBroadCast";
import MessageNotification from "@/pages/manager/MessageNotification";
import BranchCorePage from "@/pages/admin/BranchCorePage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* Cashier */}
        <Route element={<ProtectedRoute allowedRoles={['cashier']} />}>
          <Route path="/" element={<BaseLayout />}>
            <Route index element={<Navigate to="sales" replace />} />
            <Route path="/sales" element={<CheckOutPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="payment-cancel" element={<PaymentCancel />} />
            <Route path="/sales-history" element={<HistoryPage />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="conversation" element={<MessageBroadCast />} />

            <Route path="view-stocks" element={<ViewStockRequest />} />
            <Route path="branches" element={<Branches />} />
            <Route path="branch-details/:id" element={<BranchCorePage />} />
            <Route path="managers" element={<Managers />} />
            <Route path="products" element={<Inventory />} />
            <Route path="discount" element={<Discount />} />
            <Route path="stock-request-detail" element={<ViewStockDetail />} />
          </Route>
        </Route>

        {/* Manager */}
        <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="stocks" element={<Stock />} />
            <Route path="products" element={<ViewInventory />} />
            <Route path="staff-management" element={<StaffManagement />} />
            <Route path="branch-sales" element={<BranchSales />} />
            <Route path="transactions/:id" element={<TransactionDetails/>} />
            <Route path="sale-analysis" element={<BranchSaleAnalysis/>} />
            <Route path="conversation" element={<MessageNotification />} />
            
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
