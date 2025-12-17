import ViewItems from '@/components/tanstacktable/page';
import { productColumns } from '@/components/tanstacktable/productColumns';
import { AddInventory } from '@/components/sheet/AddInventory';
import { useInventory } from "@/hooks/useInventory";
import { useAuth } from '@/app/providers/AuthProvider';
import Pagination from '@/components/ui/Pagination';
import { Input } from '@/components/ui/input';

const Inventory = () => {
  const { productsQuery, page, setPage, search, setSearch } = useInventory();
  const { user } = useAuth();

  if (!user) return <p>Something Wrong ! Please LogIn Again...</p>;
  if (productsQuery.isLoading) return <p>Loading products...</p>;
  if (productsQuery.isError) return <p>Error loading data</p>;

  const response = productsQuery.data ?? {
    items: [],
    total: 0,
    limit: 10,
    page: 1
  };

  const items = response.items;
  const total = response.total;
  const totalPages = Math.ceil(total / response.limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className='flex flex-col gap-2'>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>

        <AddInventory />
      </div>

      {/* Search */}
      <Input
        className='max-w-md flex justify-end w-full'
        placeholder="Search by product..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />


      {/* Table */}
      <ViewItems items={items} columns={productColumns(user.role)} />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />

    </div>
  );
};

export default Inventory;
