import axios from "axios";
import type { Product } from "@/lib/types/product";

const API_URL = "http://localhost:5003/api/inventory";

export const InventoryService = {
  // GET ALL products
  getAll: async (): Promise<Product[]> => {
    const res = await axios.get(`${API_URL}`, {
      withCredentials: true,
    });
    return res.data;
  },

  // CREATE new product
  create: async (data: Product): Promise<Product> => {
    const res = await axios.post(`${API_URL}/add-product`, data, {
      withCredentials: true,
    });
    return res.data;
  },
  // CREATE new product
  update: async (data: Product): Promise<Product> => {
    
    const res = await axios.put(`${API_URL}/${data._id}`, data, {
      withCredentials: true,
    });
    return res.data;
  },
  delete: async (data: Product): Promise<Product> => {
    
    const res = await axios.delete(`${API_URL}/${data._id}`, {
      withCredentials: true,
    });
    return res.data;
  },
};
