import { useQuery } from "@tanstack/react-query";
import { StockInventoryService } from "@/services/stock.service";
import type { RestockRequest } from "@/lib/types/restock";

// Hook to fetch all stock requests for admin
export function useAdminStockRequests() {
  return useQuery<RestockRequest[], Error>({
    queryKey: ["admin-stock-requests"],
    queryFn: async () => {
      const res = await StockInventoryService.listallStockRequest();
      if (!res?.data?.data) throw new Error("Invalid stock request list response");

      // Map API response to match RestockRequest type
      return res.data.data.map((item: any) => ({
        _id: item._id,
        requestedBy: item.requestedBy,
        status: item.status,
        createdAt: item.createdAt,
        branch: {
          _id: item.branchId,
          name: item.branchName,
        },
        items: item.items || [],
        manager: item.manager,
      }));
    },
    initialData: [],
  });
}

// Hook to fetch a single stock request by ID
export function useStockRequestItems(requestId?: string) {
  return useQuery<RestockRequest, Error>({
    queryKey: ["admin-stock-request", requestId],
    enabled: !!requestId,
    queryFn: async () => {
      if (!requestId) throw new Error("No requestId provided");

      const res = await StockInventoryService.listallStockRequestItemsById(requestId);

      if (!res) throw new Error("Invalid stock request response");

      // API response already matches RestockRequest type
      return res;
    },
  });
}
