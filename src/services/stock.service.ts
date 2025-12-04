import axios from "axios";
import type { BranchProduct, Product } from "@/lib/types/product";
import type { RestockRequest, RestockRequestPayload } from "@/lib/types/restock";

const STOCK_URL = "http://localhost:5003/api/stock"

export const StockInventoryService = {
  // GET ALL products
  listallStockRequest: async (): Promise<RestockRequest[]> => {
    const res = await axios.get(`${STOCK_URL}/stock-requests`, {
      withCredentials: true,
    });
    return res.data;
  },
  listallStockRequestItemsById: async (requestId:string) => {
    const res = await axios.get(`${STOCK_URL}/stock-requests-items/${requestId}`, {
      withCredentials: true,
    });
    
    return res;
  },
  // Approve single item
   approveItem: async (requestId: string, requestItemId: string, qty: number)  => {
    
    const res = await axios.put(
      `${STOCK_URL}/item/${requestItemId}/approve`,
      { approvedQty: qty },
      { withCredentials: true }
    );
    return res.data;
  },

  // Reject single item
  rejectItem: async (requestId: string, requestItemId: string) => {
    const res = await axios.put(
      `${STOCK_URL}/item/${requestItemId}/reject`,
      {},
      { withCredentials: true }
    );
    return res.data;
  },

  // Approve ALL
  approveAll: async (requestId: string, items: any[]) => {
    const res = await axios.put(
      `${STOCK_URL}/approve-all`,
      { requestId, items },
      { withCredentials: true }
    );
    return res.data;
  },

  // CREATE new product
  //   create: async (data: RestockRequestPayload ): Promise<Product> => {
  //     const res = await axios.post(`${STOCK_URL}/`, data, {
  //       withCredentials: true,
  //     });
  //     return res.data;
  //   },
};
