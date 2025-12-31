import axios from "axios";
import type {  Product } from "@/lib/types/product";
import type { RestockRequestPayload } from "@/lib/types/restock";

type GetBranchStockParams = {
  page: number;
  limit: number;
  search: string;
};
const API_URL = "/api/inventory"
const STOCK_URL = "/api/stock"
// const API_URL = "http://localhost:5003/api/inventory"
// const STOCK_URL = "http://localhost:5003/api/stock"

export const BranchInventoryService = {
  // GET ALL products


getBranchStock: async ({
  page,
  limit,
  search,
}: GetBranchStockParams) => {
  const res = await axios.get(
    `${API_URL}/branch/stock?page=${page}&limit=${limit}&search=${search}`,
    { withCredentials: true }
  );

  return res.data;
},
  

  // CREATE new product
  create: async (data: RestockRequestPayload ): Promise<Product> => {
    const res = await axios.post(`${STOCK_URL}/`, data, {
      withCredentials: true,
    });
    return res.data;
  },
};
