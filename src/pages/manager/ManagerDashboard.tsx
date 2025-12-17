import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { ChartBar } from "@/components/chart/BarChart";
import DashBoardCard from "@/components/DashBoardCard";
import { useSales } from "@/hooks/useSales";
import { useAuth } from "@/app/providers/AuthProvider";

const ManagerDashboard = () => {
  const socket = useSocket();
  const { getSummarySales, queryClient } = useSales();
  const { data: dashboard, isPending } = getSummarySales;
  const { user } = useAuth()
  console.log("dashboardmanager",dashboard);
  
  // 🔥 Listen for Kafka → Socket → UI updates
  useEffect(() => {
    if (!socket) return;

    socket.on("dashboard-sales-update", (data) => {
      if (data.type === "BRANCH_UPDATE" && data.branchId === user?.branchId) {
         queryClient.setQueryData(["sales-summary"], data.summary);
      }
    });


    return () => {
      socket.off("dashboard-sales-update");
    };
  }, [socket]);


  const chartData = dashboard?.daily ?? [];

  // === Daily Revenue ===
  const today = new Date().toISOString().split("T")[0];
  const todayData = dashboard?.daily?.find((d: any) => d.date === today) || {
    cash: 0,
    card: 0,
    count: 0
  };

  const todaysRevenue = todayData.cash + todayData.card;
  const todaysPurchase = todayData.count;

  // === Monthly Total ===
  const monthlyTotal = dashboard?.monthlyTotal ?? 0;

  // === Yearly Total ===
  const yearlyTotal = dashboard?.yearlyTotal ?? 0;

  // === Today's Transaction Count ===
  const todaysTransactions = todayData.count;

  return (
    <div className="flex flex-col gap-5">
      <DashBoardCard
        todaysRevenue={todaysRevenue}
        todaysPurchase={todaysPurchase}
        monthlyTotal={monthlyTotal}
        yearlyTotal={yearlyTotal}
        todaysTransactions={todaysTransactions}
        loading={isPending}
      />

      <ChartBar chartData={chartData} loading={isPending} />
    </div>
  );
};

export default ManagerDashboard;
