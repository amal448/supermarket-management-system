import type { CreatePaymentDTO, PaymentResponse } from "@/lib/types/payment";
import type { SaleEntity } from "@/lib/types/sales";
import axios from "axios";

const API_URL = "http://localhost:5004/api/sales";

export const SalesService = {
    //Manager DashBoard
    async getSalesSummary() {
        const res = await axios.get(`${API_URL}/sales-summary`,{withCredentials:true});
        return res.data; // [{ date, cash, card }]
    },
    // GET ALL products
    getMySales: async (): Promise<SaleEntity> => {
        const res = await axios.get(`${API_URL}/`, {
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
