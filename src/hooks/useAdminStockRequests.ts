import type { RestockRequest } from "@/lib/types/restock";
import { StockInventoryService } from "@/services/stock.service";
import { useQuery } from "@tanstack/react-query";


export function useAdminStockRequests() {
  return useQuery({
    queryKey: ["admin-stock-requests"],
    queryFn: StockInventoryService.listallStockRequest
  });
}

// Fetch a single request for detail page
// Example: useAdminStockRequests.ts
export function useStockRequestItems(requestId?: string) {
  return useQuery<RestockRequest>({
    queryKey: ["admin-stock-request", requestId],
    queryFn: async () => {
      if (!requestId) throw new Error("No requestId provided");
      const { data } = await StockInventoryService.listallStockRequestItemsById(requestId);
      
      return data; // should be a single RestockRequest object
    },
    enabled: !!requestId, // only run when requestId exists
  });
}

