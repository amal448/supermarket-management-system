import   { type AxiosResponse } from "axios";
import type { RestockRequest, RestockRequestItem } from "@/lib/types/restock";
import { api } from "./api";

type ApiResponse<T> = {
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// const STOCK_URL = "http://localhost:5003/api/stock";
const STOCK_URL = "stock";

export const StockInventoryService = {
  /** GET ALL stock requests (with pagination) */
  listallStockRequest(): Promise<AxiosResponse<ApiResponse<RestockRequest[]>>> {
    return api.get<ApiResponse<RestockRequest[]>>(`${STOCK_URL}/stock-requests`, {
      withCredentials: true,
    });
  },

  /** GET single stock request by ID */
  listallStockRequestItemsById(requestId: string): Promise<RestockRequest> {
    return api
      .get<RestockRequest>(`${STOCK_URL}/stock-requests-items/${requestId}`, {
        withCredentials: true,
      })
      .then((res) => res.data);
  },

  /** Approve a single item */
  approveItem(requestItemId: string, qty: number): Promise<RestockRequest> {
    return api
      .put<RestockRequest>(
        `${STOCK_URL}/item/${requestItemId}/approve`,
        { approvedQty: qty },
        { withCredentials: true }
      )
      .then((res) => res.data);
  },

  /** Reject a single item */
  rejectItem(requestItemId: string): Promise<RestockRequest> {
    return api
      .put<RestockRequest>(`${STOCK_URL}/item/${requestItemId}/reject`, {}, {
        withCredentials: true,
      })
      .then((res) => res.data);
  },

  /** Approve ALL items in a request */
  approveAll(requestId: string, items: RestockRequestItem[]): Promise<RestockRequest> {
    return api
      .put<RestockRequest>(
        `${STOCK_URL}/approve-all`,
        { requestId, items },
        { withCredentials: true }
      )
      .then((res) => res.data);
  },
};
