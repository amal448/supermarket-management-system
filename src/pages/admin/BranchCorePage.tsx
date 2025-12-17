// import { ChartBar } from '@/components/chart/BarChart';
import { DatePicker } from '@/components/DatePicker';
import { SalesLineChart } from '@/components/SalesLineChart';
import { BranchSalesAnalysisColumns } from '@/components/tanstacktable/BranchSaleAnalysisColumn';
import ViewTableItems from '@/components/tanstacktable/tablefooterpage';
import { Button } from '@/components/ui/button';
import { useSalesAnalyse } from '@/hooks/useSalesAnalyse';
import { useSocket } from '@/hooks/useSocket';
import type { Period } from '@/lib/types/saleanalyse';
import  { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const BranchCorePage = () => {
    const { id } = useParams();
    const socket = useSocket();
    const now = new Date();

    // Helper to convert date → YYYY-MM-DD without timezone issues
    function toLocalDateString(date: Date) {
        const offset = date.getTimezoneOffset();
        const local = new Date(date.getTime() - offset * 60_000);
        return local.toISOString().split("T")[0];
    }

    // Start & end of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [startDate, setStartDate] = useState<Date | undefined>(startOfMonth);
    const [endDate, setEndDate] = useState<Date | undefined>(endOfMonth);
    // const [period, setPeriod] = useState<Period>("daily");

    const [filters, setFilters] = useState({
        startDate: toLocalDateString(startOfMonth),
        endDate: toLocalDateString(endOfMonth),
        period: "daily" as Period,
    });

    // React Query hook — manual fetch
    const { getSalesAnalysis, refetch } = useSalesAnalyse(
        id,
        filters.startDate,
        filters.endDate,
        filters.period,
        !!id 
    );
    const [analytics, setAnalytics] = useState(getSalesAnalysis.data?.data ?? []);

    useEffect(() => {
        if (getSalesAnalysis.data?.data) {
            setAnalytics(getSalesAnalysis.data.data);
        }
    }, [getSalesAnalysis.data]);

    useEffect(() => {
        if (!socket) return;

        socket.on("analytics_update", (update: { data: any[]; total: any }) => {
            setAnalytics(update.data);  // <-- only set the array
            console.log("🔥 Analytics updated via socket", update.data);
        });

        return () =>{
            socket.off("analytics_update");
        } 
    }, [socket]);


    console.log("analyticsss", analytics);

    // Format API data
    const formattedItems = (analytics).map((item: any) => {
        const { year, month, day } = item._id;

        let dateString = "";
        if (day) {
            dateString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        } else if (month) {
            dateString = `${year}-${String(month).padStart(2, "0")}`;
        } else {
            dateString = `${year}`;
        }

        return {
            date: dateString,
            actualProfit: item.actualProfit,
            expectedProfit: item.expectedProfit,
            totalDiscount: item.totalDiscount,
            totalRevenue: item.totalRevenue,
            inHand: item.totalRevenue - item.totalDiscount,
            shortage: item.expectedProfit - item.actualProfit,
        };
    });

    return (
        <div className="h-full">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold">Sales Analytics</h1>

                <div className="flex gap-4 items-end">
                    <DatePicker
                        label="Start Date"
                        name="startDate"
                        defaultValue={startDate}
                        onChange={(date) => setStartDate(date!)}
                    />

                    <DatePicker
                        label="End Date"
                        name="endDate"
                        defaultValue={endDate}
                        onChange={(date) => setEndDate(date!)}
                    />

                    {/* <select
                        className="border p-2 rounded"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as Period)}
                    >
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select> */}

                    <Button
                        onClick={() => {
                            const start = startDate ? toLocalDateString(startDate) : filters.startDate;
                            const end = endDate ? toLocalDateString(endDate) : filters.endDate;

                            setFilters({ startDate: start, endDate: end, period:"daily" });
                            refetch();
                        }}
                    >
                        Submit
                    </Button>
                </div>
            </div>

            {getSalesAnalysis.isLoading ? (
                <p>Loading analytics...</p>
            ) : getSalesAnalysis.isError ? (
                <p className="text-red-500">Error loading data</p>
            ) : (
                <div>
                    <SalesLineChart apiData={analytics} />

                    <ViewTableItems
                        items={formattedItems}
                        totalData={getSalesAnalysis.data?.total}
                        columns={BranchSalesAnalysisColumns()}
                    />
                </div>
            )}
        </div>
    );
};

export default BranchCorePage;
