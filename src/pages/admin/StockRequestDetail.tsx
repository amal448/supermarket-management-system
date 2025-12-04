import ViewItems from "@/components/tanstacktable/page";
import { stockRequestItemColumns } from "@/components/tanstacktable/requestItemColumns";
import type { RestockRequestItem } from "@/lib/types/restock";
import { useState } from "react";
import { StockInventoryService } from "@/services/stock.service";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useStockRequestItems } from "@/hooks/useAdminStockRequests";

export default function ViewStockDetail() {
  const queryClient = useQueryClient();
 const { state } = useLocation();
const requestId = state?.request?._id;  // <-- Use the _id


  const { data: request, isLoading, isError, refetch } = useStockRequestItems(requestId);

  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());

  if (!requestId) return <div>No request selected</div>;
  if (isLoading) return <div>Loading...</div>;
  if (isError || !request) return <div>Error loading request</div>;

  // ✅ Approve selected items
  const handleApproveItem = async () => {
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
  const handleRejectItem = async () => {
    for (const requestItemId of selectedItems.keys()) {
      const item = request.items.find((i: RestockRequestItem) => i.requestItemId === requestItemId);
      if (!item) continue;

      await StockInventoryService.rejectItem(item.requestId, requestItemId);
    }
    alert("Rejected selected items!");
    setSelectedItems(new Map());
    refetch(); // 🔄 Refetch request items from backend
  };

  // ✅ Approve entire request
  const handleApproveAll = async () => {
    await StockInventoryService.approveAll(request._id, request.items);
    alert("Entire request approved!");
    queryClient.invalidateQueries({ queryKey: ["admin-stock-requests"] });
    refetch(); // 🔄 Refetch items
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
      <h2>Branch: {request.branchName}</h2>

      <ViewItems
        items={request.items}
        columns={stockRequestItemColumns({
          selectedItems,
          handleSelectProduct,
          handleItemQuantityChange,
          handleApproveItem,
          handleRejectItem,
        })}
      />

      <div className="flex justify-end gap-2 my-4 mx-5 ">
        <Button disabled={request.status!='ACCEPTED'} className="bg-green-600" onClick={handleApproveAll}>
          Approve Entire Request
        </Button>
      </div>
    </div>
  );
}
