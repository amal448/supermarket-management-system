// src/services/auth.service.ts
import axios from "axios";
import type { User } from "@/lib/types/user";

export type LoginData = { email: string; password: string };
export type LoginResponse = { user: User; accessToken: string };

const API_URL = "http://localhost:5000/api/auth";

export const AuthService = {
  login: async (data: LoginData): Promise<LoginResponse> => {
    const res = await axios.post(`${API_URL}/login`, data, {
      withCredentials: true, // sets refresh token cookie
    });
    return res.data;
  },

  logout: async () => {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  },

  refreshToken: async (): Promise<{ accessToken: string; user: User }> => {
    const res = await axios.get(`${API_URL}/refresh`, { withCredentials: true });
    return res.data;
  },
};
