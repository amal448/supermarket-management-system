import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useStockRequestItems } from "@/hooks/useAdminStockRequests";
import { StockInventoryService } from "@/services/stock.service";
import ViewItems from "@/components/tanstacktable/page";
import { stockRequestItemColumns } from "@/components/tanstacktable/requestItemColumns";
import Pagination from "@/components/ui/Pagination";
import { Button } from "@/components/ui/button";
import type { RestockRequestItem } from "@/lib/types/restock";

export default function ViewStockDetail() {
  const { id: requestId } = useParams<{ id: string }>();
  
  // Always call hooks at the top level
  const { data: request, isLoading, isError, refetch } = useStockRequestItems(requestId || "");
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Handle no requestId
  if (!requestId) return <div>No request selected</div>;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading request</div>;
  if (!request) return <div>Request not found</div>;

  // Pagination
  const totalItems = request.items?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedItems = useMemo<RestockRequestItem[]>(() => {
    return request.items?.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE) || [];
  }, [request.items, page]);

  /** ---------------- Select / Unselect Item ---------------- */
  const handleSelectProduct = (item: RestockRequestItem) => {
    setSelectedItems((prev) => {
      const copy = new Map(prev);
      if (copy.has(item.requestItemId)) copy.delete(item.requestItemId);
      else copy.set(item.requestItemId, item.requestedQty || 1);
      return copy;
    });
  };

  /** ---------------- Quantity Change ---------------- */
  const handleItemQuantityChange = (requestItemId: string, qty: number) => {
    setSelectedItems((prev) => {
      const copy = new Map(prev);
      copy.set(requestItemId, qty);
      return copy;
    });
  };

  /** ---------------- Approve Selected ---------------- */
  const handleApproveSelected = async () => {
    for (const [requestItemId, qty] of selectedItems.entries()) {
      await StockInventoryService.approveItem(requestItemId, qty);
    }
    alert("Approved selected items!");
    setSelectedItems(new Map());
    refetch();
  };

  /** ---------------- Reject Selected ---------------- */
  const handleRejectSelected = async () => {
    for (const requestItemId of selectedItems.keys()) {
      await StockInventoryService.rejectItem(requestItemId);
    }
    alert("Rejected selected items!");
    setSelectedItems(new Map());
    refetch();
  };

  return (
    <div>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight">
        Branch: {request.branch?.name || "N/A"}
      </h2>

      {/* Items Table */}
      <ViewItems
        items={paginatedItems}
        columns={stockRequestItemColumns({
          selectedItems,
          handleSelectProduct,
          handleItemQuantityChange,
        })}
      />

      {/* Approve / Reject Buttons */}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </div>
  );
}
