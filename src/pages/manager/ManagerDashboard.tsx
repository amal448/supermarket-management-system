import { ChartBar } from "@/components/chart/BarChart";
import DashBoardCard from "@/components/DashBoardCard";
import { useSales } from "@/hooks/useSales";

const ManagerDashboard = () => {
  const { getSummarySales } = useSales();

  const data = getSummarySales.data;
  const isLoading = getSummarySales.isLoading;

  const chartData = data?.daily ?? [];

  // === Daily Revenue ===
  const today = new Date().toISOString().split("T")[0];
  const todayData = data?.daily?.find((d: any) => d.date === today) || {
    cash: 0,
    card: 0,
    count: 0
  };

  const todaysRevenue = todayData.cash + todayData.card;
  const todaysPurchase = todayData.count
  // === Monthly Total ===
  const monthlyTotal = data?.monthlyTotal ?? 0;

  // === Yearly Total ===
  const yearlyTotal = data?.yearlyTotal ?? 0;

  // === Today's Transaction Count ===
  const todaysTransactions = todaysRevenue > 0 ? 1 : 0; // if you track count separately, replace later

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

export default ManagerDashboard;
