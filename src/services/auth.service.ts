// src/services/auth.service.ts
import { api } from "./api";
import type { User } from "@/lib/types/user";

export type LoginData = { email: string; password: string };
export type LoginResponse = { user: User; accessToken: string };

const API_URL = "/api/auth";

export const AuthService = {
  /** Login with credentials */
  login: async (data: LoginData): Promise<LoginResponse> => {
    const res = await api.post(`${API_URL}/login`, data, {
      withCredentials: true, // ensures refresh token cookie is set
    });
    return res.data; // { user, accessToken }
  },

  /** Logout user */
  logout: async () => {
    try {
      await api.post(`${API_URL}/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  },

  /** Refresh access token using cookie */
  refreshToken: async (): Promise<{ accessToken: string; user: User }> => {
    try {
      const res = await api.get(`${API_URL}/refresh`, {
        withCredentials: true, // sends refresh token cookie
      });
      // Expect response: { accessToken: string, user: User }
      if (!res.data?.accessToken || !res.data?.user) {
        throw new Error("Invalid refresh token response");
      }
      return res.data;
    } catch (err) {
      console.error("Refresh token failed:", err);
      throw err;
    }
  },
};
