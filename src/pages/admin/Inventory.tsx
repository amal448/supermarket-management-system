import ViewItems from '@/components/tanstacktable/page';
import { productColumns } from '@/components/tanstacktable/productColumns';
import { AddInventory } from '@/components/sheet/AddInventory';
import { useInventory } from "@/hooks/useInventory";
import { useAuth } from '@/app/providers/AuthProvider';

const Inventory = () => {
  const { productsQuery } = useInventory();
  const { user } = useAuth()


  if (!user) return <p>Something Wrong ! Please LogIn Again...</p>;
  if (productsQuery.isLoading) return <p>Loading products...</p>;
  if (productsQuery.isError) return <p>Error loading data</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>

        <AddInventory />
      </div>

      <ViewItems  items={productsQuery.data ?? []} columns={productColumns(user.role)} />
    </div>
  );
};

export default Inventory;
