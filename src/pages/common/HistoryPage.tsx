import { CashierColumns } from "@/components/tanstacktable/cashierColumns";
import ViewItems from "@/components/tanstacktable/page";
import Pagination from "@/components/ui/Pagination";
import { useSales } from "@/hooks/useSales";

const HistoryPage = () => {

  const { salesQuery, page, setPage } = useSales();

  if (salesQuery.isLoading) {
    return <p>Loading transactions...</p>;
  }

  if (salesQuery.isError) {
    return (
      <p className="text-red-500">
        {salesQuery.error.message || "Something went wrong"}
      </p>
    );
  }


  const response = salesQuery.data ?? {
    data: [],
    total: 0,
    limit: 10,
    page: 1
  };

  const items = response.data;
  const total = response.total;
  const totalPages = Math.ceil(total / response.limit);

  return (
    <div className="h-full">
         <div className="flex items-center justify-between">
                 <div className='flex flex-col gap-2 pb-4'>
                    <h1 className="text-3xl font-bold text-foreground">Transaction History</h1>
                    <p className="text-muted-foreground">For More Info Connect your Manager</p>
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
