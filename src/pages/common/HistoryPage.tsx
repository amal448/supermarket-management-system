import { CashierColumns } from '@/components/tanstacktable/cashierColumns';
import ViewItems from '@/components/tanstacktable/page';
import { useSales } from '@/hooks/useSales';
import type { SaleEntity } from '@/lib/types/sales';

const HistoryPage = () => {
    const { salesQuery } = useSales();
    console.log("salesQuery", salesQuery);

    if (salesQuery.isLoading) return <p>Loading products...</p>;
    if (salesQuery.isError) {
        const errMsg =
            (salesQuery.error as any)?.response?.data?.message ||
            (salesQuery.error as any)?.message ||
            "Something went wrong";

        return <p className="text-red-500">{errMsg}</p>;
    }
    const items: SaleEntity[] = Array.isArray(salesQuery.data)
        ? salesQuery.data
        : salesQuery.data
            ? [salesQuery.data]   // wrap single sale
            : [];


    return (
        <div className="h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Latest Transactions</h1>
                    <p className="text-muted-foreground">For More Clarification Connect your Branch  Manager</p>
                </div>
            </div>

            <ViewItems items={items} columns={CashierColumns()} />
        </div>
    );
};

export default HistoryPage;
