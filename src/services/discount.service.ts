import axios from "axios";
import type{ DiscountEntity } from "@/lib/types/discount";
const API_URL = "http://localhost:5004/api/discounts";

export const DiscountService = {
    // GET all branches
    getAllDiscountOffers: async () => {
        const res = await axios.get(`${API_URL}/`, {
            withCredentials: true,
        });
        return res.data;
    },

    // CREATE branch
    create: async (data: any) => {
        const res = await axios.post(`${API_URL}/`,  data , {
            withCredentials: true,
        });
        return res.data;
    },
    // discount api 
    applydiscount: async (data: any) => {
        const res = await axios.post(`${API_URL}/apply`,  data , {
            withCredentials: true,
        });
        return res.data;
    },
    // CREATE new product
    update: async (data: DiscountEntity): Promise<DiscountEntity> => {

        const res = await axios.put(`${API_URL}/${data.id}`, data, {
            withCredentials: true,
        });
        return res.data;
    },
    // GET branch by id
    getById: async (_id: string) => {
        const res = await axios.get(`${API_URL}`, {
            withCredentials: true,
        });
        return res.data;
    },
    delete: async (id: string) => {
        const res = await axios.delete(`${API_URL}/${id}`, {
            withCredentials: true,
        });
        return res.data;
    },
};
