import { CashierColumns } from '@/components/tanstacktable/cashierColumns';
import ViewItems from '@/components/tanstacktable/page';
import Pagination from '@/components/ui/Pagination';
import { useSales } from '@/hooks/useSales';
import type { SaleEntity } from '@/lib/types/sales';

const HistoryPage = () => {
    const { salesQuery, page, setPage } = useSales();
    console.log("salesQuery", salesQuery);

    if (salesQuery.isLoading) return <p>Loading products...</p>;
    if (salesQuery.isError) {
        const errMsg =
            (salesQuery.error as any)?.response?.data?.message ||
            (salesQuery.error as any)?.message ||
            "Something went wrong";

        return <p className="text-red-500">{errMsg}</p>;
    }
   // Extract sales data and pagination info
  const items: SaleEntity[] = salesQuery.data?.data || [];
  const totalPages: number = salesQuery.data?.totalPages || 1;

    return (
        <div className="h-full">
            <div className="flex items-center justify-between mb-4 ">
                <div className='flex flex-col gap-4'>
                    <h1 className="text-3xl font-bold text-foreground">Latest Transactions</h1>
                    <p className="text-muted-foreground">For More Clarification Connect your Branch  Manager</p>
                </div>
            </div>

            <ViewItems items={items} columns={CashierColumns()} />
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
            />
        </div>
    );
};

export default HistoryPage;
