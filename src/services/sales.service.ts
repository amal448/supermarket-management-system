import type { CreatePaymentDTO, PaymentResponse } from "@/lib/types/payment";
import type { Period } from "@/lib/types/saleanalyse";
import type { PaginatedSales, SaleEntity } from "@/lib/types/sales";
import axios from "axios";
// import { api } from "./api";
// const API_URL = "http://localhost:5004/api/sales";

const API_URL = "/api/sales";
// sales.service.ts

export const SalesService = {
    //Manager DashBoard
    async getSalesSummary() {
        const res = await axios.get(`${API_URL}/sales-summary`, { withCredentials: true });
        return res.data; // [{ date, cash, card }]
    },
    async getSalesAnalysis(
        branchId?: string,
        startDate?: string,
        endDate?: string,
        period?: Period
    ) {
        const res = await axios.get(`${API_URL}/analytics`, {
            params: { branchId, startDate, endDate, period },
            withCredentials: true,
        });
        return res.data;
    },


    // GET ALL products
    getMySales: async (page = 1, limit = 10, search = ""): Promise<PaginatedSales> => {
        const res = await axios.get(`${API_URL}?page=${page}&limit=${limit}&search=${search}`, {
            withCredentials: true,
        });
        return res.data;
    },
    getMoreSalesDetails: async (id: string): Promise<SaleEntity> => {
        const res = await axios.get(`${API_URL}/${id}`, {
            withCredentials: true,
        });
        return res.data;
    },

    // CREATE new product
    create: async (data: CreatePaymentDTO): Promise<PaymentResponse> => {
        const res = await axios.post<PaymentResponse>(`${API_URL}/payment`, data, {
            withCredentials: true,
        });
        return res.data;
    },
    //   // CREATE new product
    //   update: async (data: Product): Promise<Product> => {

    //     const res = await axios.put(`${API_URL}/${data._id}`, data, {
    //       withCredentials: true,
    //     });
    //     return res.data;
    //   },
    //   delete: async (data: Product): Promise<Product> => {

    //     const res = await axios.delete(`${API_URL}/${data._id}`, {
    //       withCredentials: true,
    //     });
    //     return res.data;
    //   },
};
