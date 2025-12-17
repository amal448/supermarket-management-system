import ViewItems from "@/components/tanstacktable/page";
import { stockRequestItemColumns } from "@/components/tanstacktable/requestItemColumns";
import type { RestockRequestItem } from "@/lib/types/restock";
import { useState } from "react";
import { StockInventoryService } from "@/services/stock.service";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useStockRequestItems } from "@/hooks/useAdminStockRequests";
import Pagination from "@/components/ui/Pagination";

export default function ViewStockDetail() {
  const { state } = useLocation();
  const requestId = state?.request?._id;  // <-- Use the _id


  const { data: request, isLoading, isError, refetch } = useStockRequestItems(requestId);

  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
  const ITEMS_PER_PAGE = 5;

  const [page, setPage] = useState(1);

  if (!requestId) return <div>No request selected</div>;
  if (isLoading) return <div>Loading...</div>;
  if (isError || !request) return <div>Error loading request</div>;

  const totalItems = request.items.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedItems = request.items.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );


  // ✅ Approve selected items
  const handleApproveSelected = async () => {
    for (const [requestItemId, qty] of selectedItems.entries()) {
      const item = request.items.find((i: RestockRequestItem) => i.requestItemId === requestItemId);
      if (!item) continue;

      await StockInventoryService.approveItem(item.requestId, requestItemId, qty);
    }
    alert("Approved selected items!");
    setSelectedItems(new Map());
    refetch(); // 🔄 Refetch request items from backend
  };

  // ✅ Reject selected items
  const handleRejectSelected = async () => {
    for (const requestItemId of selectedItems.keys()) {
      const item = request.items.find((i: RestockRequestItem) => i.requestItemId === requestItemId);
      if (!item) continue;

      await StockInventoryService.rejectItem(item.requestId, requestItemId);
    }
    alert("Rejected selected items!");
    setSelectedItems(new Map());
    refetch(); // 🔄 Refetch request items from backend
  };



  // ✅ Select/unselect item
  const handleSelectProduct = (item: RestockRequestItem) => {
    if (!item.requestItemId) return;
    setSelectedItems((prev) => {
      const copy = new Map(prev);
      if (copy.has(item.requestItemId)) copy.delete(item.requestItemId);
      else copy.set(item.requestItemId, item.requestedQty || 1);
      return copy;
    });
  };

  // ✅ Handle quantity change for selected items
  const handleItemQuantityChange = (requestItemId: string, qty: number) => {
    if (!requestItemId) return;
    setSelectedItems((prev) => {
      const copy = new Map(prev);
      copy.set(requestItemId, qty);
      return copy;
    });
  };

  return (
    <div>
      <h2 className="scroll-m-20  pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Branch: {request?.branch?.name} |{request?.branch?.location}
      </h2>

      <ViewItems
        items={paginatedItems}
        columns={stockRequestItemColumns({
          selectedItems,
          handleSelectProduct,
          handleItemQuantityChange,
        })}
      />
      <div className="flex justify-end gap-3 my-4 mx-5">
        <Button 
          disabled={selectedItems.size === 0}
          className="bg-green-400"
          onClick={handleApproveSelected}
        >
          Approve Selected
        </Button>

        <Button 
          disabled={selectedItems.size === 0}
          variant="destructive"
          onClick={handleRejectSelected}
        >
          Reject Selected
        </Button>
      </div>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}
