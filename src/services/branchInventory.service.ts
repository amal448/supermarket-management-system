import axios from "axios";
import type { BranchProduct, Product } from "@/lib/types/product";
import type { RestockRequestPayload } from "@/lib/types/restock";

const API_URL = "http://localhost:5003/api/inventory"
const STOCK_URL = "http://localhost:5003/api/stock/"

export const BranchInventoryService = {
  // GET ALL products
  getBranchStock: async (): Promise<BranchProduct[]> => {
    const res = await axios.get(`${API_URL}/branch/stock`, {
      withCredentials: true,
    });
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
