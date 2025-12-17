import { useState, useMemo } from 'react';
import ViewItems from '@/components/tanstacktable/page';
import { requestColumns } from '@/components/tanstacktable/requestColumns';
import { useAdminStockRequests } from '@/hooks/useAdminStockRequests';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ViewStockRequest = () => {
  const { data = [], isLoading, isError } = useAdminStockRequests();

  // Filters
  const [filter, setFilter] = useState<'all' | 'approved' | 'partially' | 'rejected'>('all');
  const [search, setSearch] = useState('');

  /** -------------------------------
   * Filtered Data
   --------------------------------*/
  const filteredData = useMemo(() => {
    let filtered = data?.data;
    console.log("filtereddd", filtered);

    if (filter !== 'all') {
      filtered = filtered.filter((req) => {
        if (filter === 'approved') return req.status === 'APPROVED';
        if (filter === 'partially') return req.status === 'PARTIALLY_APPROVED';
        if (filter === 'rejected') return req.status === 'REJECTED';
        return true;
      });
    }

    if (search.trim()) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        (req) =>
          req.branchName.toLowerCase().includes(lowerSearch) ||
          req.manager?.name.toLowerCase().includes(lowerSearch)
      );
    }

    return filtered;
  }, [data, filter, search]);

  if (isLoading) return <p>Loading stock requests...</p>;
  if (isError) return <p>Error loading data</p>;

  return (
    <div className="">
      <div className="flex items-center justify-between mb-4">
        <div className='flex flex-col gap-2'>
          <h1 className="text-3xl font-bold text-foreground ">Stock Management</h1>
          <p className="text-muted-foreground">Manage your stock requests</p>
        </div>
        <div className='max-w-52 w-full flex justify-end'>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center mb-4">
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
          All
        </Button>
        <Button
          variant={filter === 'approved' ? 'default' : 'outline'}
          onClick={() => setFilter('approved')}
        >
          Approved
        </Button>
        <Button
          variant={filter === 'partially' ? 'default' : 'outline'}
          onClick={() => setFilter('partially')}
        >
          Partially Approved
        </Button>
        <Button
          variant={filter === 'rejected' ? 'default' : 'outline'}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </Button>
        <Input
          placeholder="Search by branch or manager..."
          className="ml-auto w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>


      {/* Table */}
      <ViewItems items={filteredData ?? []} columns={requestColumns} />
    </div>
  );
};

export default ViewStockRequest;
