import { useEffect, useState } from "react";
import { BranchSalesAnalysisColumns } from '@/components/tanstacktable/BranchSaleAnalysisColumn';
import ViewTableItems from '@/components/tanstacktable/tablefooterpage';
import { useSalesAnalyse } from '@/hooks/useSalesAnalyse';
import { DatePicker } from '@/components/DatePicker';
import { Button } from '@/components/ui/button';
import type { Period } from "@/lib/types/saleanalyse";
import { useAuth } from "@/app/providers/AuthProvider";

const BranchSaleAnalysis = () => {
    const {user}=useAuth()
    const branchId=user?.branchId

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const [startDate, setStartDate] = useState<Date | undefined>(today);
    const [endDate, setEndDate] = useState<Date | undefined>(today);
    const [period, setPeriod] = useState<Period>("daily");

    // filters used by React Query
    const [filters, setFilters] = useState({
        startDate: todayStr,
        endDate: todayStr,
        period: "daily" as Period,
    });

    // React Query hook (manual fetch)
    const { getSalesAnalysis, refetch } = useSalesAnalyse(
        branchId,
        filters.startDate,
        filters.endDate,
        filters.period,
        false // disabled: manual fetch only
    );

    // ⬅ AUTO-FETCH today's data on component mount
    useEffect(() => {
        refetch();
    }, []);

    // Format API items
    const formattedItems = (getSalesAnalysis.data?.data ?? []).map((item: any) => {
        const { year, month, day } = item._id;

        let dateString = "";
        if (day) {
            dateString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        } else if (month) {
            dateString = `${year}-${String(month).padStart(2, "0")}`;
        } else {
            dateString = `${year}`;
        }
        const inHand = item.totalRevenue - item.totalDiscount;
        const shortage = item.expectedProfit - item.actualProfit;
        return {
            date: dateString,
            actualProfit: item.actualProfit,
            expectedProfit: item.expectedProfit,
            totalDiscount: item.totalDiscount,
            totalRevenue: item.totalRevenue,
            inHand,
            shortage,
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

                    <select
                        className="border p-2 rounded"
                        value={period}
                        onChange={(e) => setPeriod(e.target.value as Period)}
                    >
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>

                    <Button
                        onClick={() => {
                            const start = startDate?.toISOString().split("T")[0] ?? todayStr;
                            const end = endDate?.toISOString().split("T")[0] ?? todayStr;

                            setFilters({ startDate: start, endDate: end, period });
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
                <ViewTableItems
                    items={formattedItems}
                    totalData={getSalesAnalysis.data?.total}
                    columns={BranchSalesAnalysisColumns()}
                />
            )}
        </div>
    );
};

export default BranchSaleAnalysis;
