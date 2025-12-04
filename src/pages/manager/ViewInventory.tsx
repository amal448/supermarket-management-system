import ViewItems from '@/components/tanstacktable/page';
import { productColumns } from '@/components/tanstacktable/productColumns';
import { useInventory } from "@/hooks/useInventory";

const ViewInventory = () => {
  const { productsQuery } = useInventory();

  if (productsQuery.isLoading) return <p>Loading products...</p>;
  if (productsQuery.isError) return <p>Error loading data</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Products Catalog</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>

      </div>

      <ViewItems items={productsQuery.data ?? []} columns={productColumns()} />
    </div>
  );
};

export default ViewInventory;
