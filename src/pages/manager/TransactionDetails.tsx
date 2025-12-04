import { EachSalesDetailColumns } from '@/components/tanstacktable/EachSaleColumn';
import ViewItems from '@/components/tanstacktable/page';
import { useSales } from '@/hooks/useSales';
import type { SaleEntity } from '@/lib/types/sales';
import { useParams } from 'react-router-dom';

const TransactionDetails = () => {
     const { id } = useParams();
     console.log(id,"TransactionDetails");
     
    const { salesQueryDetails } = useSales(id);
    console.log("salesQueryDetails", salesQueryDetails);

    if (salesQueryDetails.isLoading) return <p>Loading products...</p>;
    if (salesQueryDetails.isError) {
        const errMsg =
            (salesQueryDetails.error as any)?.response?.data?.message ||
            (salesQueryDetails.error as any)?.message ||
            "Something went wrong";

        return <p className="text-red-500">{errMsg}</p>;
    }
    const items: SaleEntity[] = Array.isArray(salesQueryDetails.data)
        ? salesQueryDetails.data
        : salesQueryDetails.data
            ? [salesQueryDetails.data]   // wrap single sale
            : [];


    return (
        <div className="h-full">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Latest Transactions</h1>
                    <p className="text-muted-foreground">For More Clarification Connect your Branch  Manager</p>
                </div>
            </div>

            <ViewItems items={items} columns={EachSalesDetailColumns()} />
        </div>
    );
};

export default TransactionDetails;
