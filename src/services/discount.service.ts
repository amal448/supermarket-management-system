// import axios from "axios";
import { api } from "./api";
import type{ DiscountEntity } from "@/lib/types/discount";
// const API_URL = "http://localhost:5004/api/discounts";

const API_URL = "discounts";

export const DiscountService = {
    // GET all branches
    getAllDiscountOffers: async () => {
        const res = await api.get(`${API_URL}/`, {
            withCredentials: true,
        });
        return res.data;
    },

    // CREATE branch
    create: async (data: any) => {
        const res = await api.post(`${API_URL}/`,  data , {
            withCredentials: true,
        });
        return res.data;
    },
    // discount api 
    applydiscount: async (data: any) => {
        const res = await api.post(`${API_URL}/apply`,  data , {
            withCredentials: true,
        });
        return res.data;
    },
    // CREATE new product
    update: async (data: DiscountEntity): Promise<DiscountEntity> => {

        const res = await api.put(`${API_URL}/${data.id}`, data, {
            withCredentials: true,
        });
        return res.data;
    },
    // GET branch by id
    getById: async (_id: string) => {
        const res = await api.get(`${API_URL}`, {
            withCredentials: true,
        });
        return res.data;
    },
    delete: async (id: string) => {
        const res = await api.delete(`${API_URL}/${id}`, {
            withCredentials: true,
        });
        return res.data;
    },
};
