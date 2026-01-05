// import axios from "axios";
import { api } from "./api";

const API_URL = "/api/auth";
// const API_URL = "http://localhost:5003/api/branch";
export const BranchService = {
    // GET all branches
    getAll: async () => {
        const res = await api.get(`${API_URL}/all-branch`, {
            withCredentials: true,
        });
        return res.data;
    },

    // CREATE branch
    create: async (data: any) => {
       const res = await api.post(`${API_URL}/add-branch`,{data}, {
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
};
