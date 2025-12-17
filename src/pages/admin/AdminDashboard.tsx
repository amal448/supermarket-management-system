import { useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { ChartBar } from "@/components/chart/BarChart";
import DashBoardCard from "@/components/DashBoardCard";
import { useSales } from "@/hooks/useSales";

const AdminDashboard = () => {
  const socket = useSocket();
  const { getSummarySales, queryClient } = useSales();
  const { data: dashboard } = getSummarySales;


  // 🔥 Listen for Kafka → Socket → UI updates
  useEffect(() => {
    if (!socket) return;

    socket.on("dashboard-sales-update", (updatedData) => {
      console.log("📊 Real-Time Dashboard Update Received:", updatedData);
      if (updatedData.type === "GLOBAL_UPDATE") {
        queryClient.setQueryData(["sales-summary"], updatedData.summary);
      }
      // Update UI instantly using React Query
    });

    return () => {
      socket.off("dashboard-sales-update");
    };
  }, [socket]);

  // const data = getSummarySales.data;
  const isLoading = getSummarySales.isLoading;

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
        loading={isLoading}
      />

      <ChartBar chartData={chartData} loading={isLoading} />
    </div>
  );
};

export default AdminDashboard;
