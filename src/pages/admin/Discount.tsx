import { AddDiscount } from '@/components/sheet/AddDiscount';
import { DiscountColumns } from '@/components/tanstacktable/discountColumns';
import ViewItems from '@/components/tanstacktable/page';
import { useDiscount } from '@/hooks/useDiscount';

const Discount = () => {
    const { discountQuery } = useDiscount();
    console.log(discountQuery.data);
    const filterData = discountQuery.data

    const discountTag = Array.isArray(filterData)
        ? filterData.map((item) => item.type)
        : [];


    if (discountQuery.isLoading) return <p>Loading products...</p>;
    if (discountQuery.isError) {
        const errMsg =
            (discountQuery.error as any)?.response?.data?.message ||
            (discountQuery.error as any)?.message ||
            "Something went wrong";

        return <p className="text-red-500">{errMsg}</p>;
    }


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className='flex flex-col gap-2'>
                    <h1 className="text-3xl font-bold text-foreground">Discount Management</h1>
                    <p className="text-muted-foreground">Manage your Discount Offers</p>
                </div>
                <AddDiscount />
            </div>

           <ViewItems
  items={Array.isArray(discountQuery.data) ? discountQuery.data : []}
  columns={DiscountColumns({ discountTag })}
/>

        </div>
    );
};

export default Discount;
