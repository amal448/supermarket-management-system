// src/services/user.service.ts

import type { User } from "@/lib/types/user";
// import axios from "axios";
import { api } from "./api";

// const API_URL = "http://localhost:5000/api";
const API_URL = "user";
export type Manager = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  branchId: string;
};
export const UserService = {
  // Get all MANAGERS
  getManagers: async (): Promise<User[]> => {
    const res = await api.get(`${API_URL}/get-all-manager`, {
      withCredentials: true,
    });
    return res.data;
  },
  // OPTIONAL: get all users (if needed later)
  getAll: async (): Promise<User[]> => {
    const res = await api.get(`${API_URL}/getalluser`, {
      withCredentials: true,
    });

    return res.data;
  },
  addUser: async (data: any, role: string): Promise<User[]> => {
    const endpoint =
      role === "admin" ? "/auth/register" : "/user/create-user";

    const res = await api.post(`${API_URL}${endpoint}`, data, {
      withCredentials: true,
    });

    return res.data;
  },
  editUser: async (data: any,): Promise<Manager[]> => {
    const endpoint = '/update-user'


    const res = await api.post(`${API_URL}${endpoint}`, data, {
      withCredentials: true,
    });

    return res.data;
  },
  deleteUser: async (id: any,): Promise<User[]> => {
    const endpoint = '/delete-user'


    const res = await api.post(`${API_URL}${endpoint}`, { id }, {
      withCredentials: true,
    });

    return res.data;
  },

};
