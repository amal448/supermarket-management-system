// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { AuthService } from "@/services/auth.service";
import type { User } from "@/lib/types/user";
import { api } from "@/services/api";

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  loading: boolean;
  initialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const refreshingRef = useRef(false); // avoids double refresh

  /** Axios interceptor */
  console.log("✅ Updated auth.service.ts loaded");
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use((config) => {
      // Always attach latest token
      if (config.headers && !config.url?.includes("/auth/login") && !config.url?.includes("/auth/refresh")) {
        if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    const responseInterceptor = api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("/auth/refresh")
        ) {
          originalRequest._retry = true;

          try {
            await refreshAccessToken();
            return api(originalRequest); // retry request after refresh
          } catch {
            await logout();
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  /** Initialization */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshAccessToken();
      } catch {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };
    initializeAuth();
  }, []);

  /** Login */
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await AuthService.login({ email, password });
      setUser(res.user);
      setAccessToken(res.accessToken);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  /** Logout */
  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    setAccessToken(null);
  };

  /** Refresh token */
  const refreshAccessToken = async () => {
    if (refreshingRef.current) return;
    refreshingRef.current = true;

    try {
      const res = await AuthService.refreshToken();
      setAccessToken(res.accessToken);
      setUser(res.user);
    } catch {
      setUser(null);
      setAccessToken(null);
      await logout();
    } finally {
      refreshingRef.current = false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, initialized, accessToken, login, logout, refreshAccessToken, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
