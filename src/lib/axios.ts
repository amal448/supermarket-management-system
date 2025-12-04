// src/lib/axios.ts
import axios from "axios";
import { AuthService } from "@/services/auth.service";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // important for cookies
});

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const data = await AuthService.refreshToken(); // refresh token from cookie
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return instance(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
