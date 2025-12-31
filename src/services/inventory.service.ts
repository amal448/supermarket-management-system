import type { PaginatedProducts, Product } from "@/lib/types/product";
import { api } from "./api";
// const API_URL = "http://localhost:5003/api/inventory";
const API_URL = "/api/inventory";

export const InventoryService = {
  // GET ALL products
  getAll: async (page = 1, limit = 10, search = ""): Promise<PaginatedProducts> => {
    const res = await api.get(`${API_URL}?page=${page}&limit=${limit}&search=${search}`, {
      withCredentials: true,
    });
    return res.data;
  },

  // CREATE new product
  create: async (data: Product): Promise<Product> => {
    const res = await api.post(`${API_URL}/add-product`, data, {
      withCredentials: true,
    });
    return res.data;
  },
  // CREATE new product
  update: async (data: Product): Promise<Product> => {
    
    const res = await api.put(`${API_URL}/${data._id}`, data, {
      withCredentials: true,
    });
    return res.data;
  },
  delete: async (data: Product): Promise<Product> => {
    
    const res = await api.delete(`${API_URL}/${data._id}`, {
      withCredentials: true,
    });
    return res.data;
  },
};
