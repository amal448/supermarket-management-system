import { useAuth } from '@/app/providers/AuthProvider';
import ViewItems from '@/components/tanstacktable/page';
import { productColumns } from '@/components/tanstacktable/productColumns';
import Pagination from '@/components/ui/Pagination';
import { useInventory } from "@/hooks/useInventory";

const ViewInventory = () => {
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
          <h1 className="text-3xl font-bold text-foreground">Products Catalog</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>

      </div>

      <ViewItems items={items} columns={productColumns(user.role)} />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};

export default ViewInventory;
