import { BranchSalesColumns } from '@/components/tanstacktable/branchSalesColumns';
import ViewItems from '@/components/tanstacktable/page';
import { useSales } from '@/hooks/useSales';
import type { SaleEntity, PaginatedSales } from '@/lib/types/sales';
import { useNavigate } from 'react-router-dom';
import Pagination from '@/components/ui/Pagination';

const BranchSales = () => {
    const navigate = useNavigate();
    const { salesQuery, page, setPage } = useSales();

    if (salesQuery.isLoading) return <p>Loading sales...</p>;
    if (salesQuery.isError) {
        const errMsg =
            (salesQuery.error as any)?.response?.data?.message ||
            (salesQuery.error as any)?.message ||
            "Something went wrong";

        return <p className="text-red-500">{errMsg}</p>;
    }

    const paginatedSales: PaginatedSales | undefined = salesQuery.data;
    const items: SaleEntity[] = paginatedSales?.data || [];
    const totalPages: number = paginatedSales?.totalPages || 1;

    if (items.length === 0) return <p>No sales found.</p>;

    return (
        <div className="h-full">
            <div className="flex items-center justify-between mb-4">
                <div className='flex flex-col gap-2'>
                    <h1 className="text-3xl font-bold text-foreground">Latest Transactions</h1>
                    <p className="text-muted-foreground">For more clarification, connect your Branch Manager</p>
                </div>
            </div>

            <ViewItems items={items} columns={BranchSalesColumns(navigate)} />

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
            />
        </div>
    );
};

export default BranchSales;
