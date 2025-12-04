import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "@/services/auth.service";
import type { User } from "@/lib/types/user";
import axios from "axios";

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  loading: boolean;
  initialized :boolean
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /** Axios interceptor to attach access token */
  useEffect(() => {
    
    const requestInterceptor = axios.interceptors.request.use((config) => {
      if (accessToken && config.headers) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    });

    const responseInterceptor = axios.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes("/refresh")
        ) {
          originalRequest._retry = true;
          try {
            await refreshAccessToken();
            return axios(originalRequest);
          } catch {
            await logout();
            return Promise.reject(error);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken]);

  /** Initialization: refresh token if exists */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await refreshAccessToken();
      } catch {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
         setInitialized(true); // now the app knows auth check is done
      }
    };
    initializeAuth();
  }, []);

  /** Login */
  const login = async (email: string, password: string): Promise<User> => {
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

  /** Refresh access token */
  const refreshAccessToken = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      const res = await AuthService.refreshToken(); // cookie-based refresh
      setAccessToken(res.accessToken);
      setUser(res.user);
    } catch (err) {
      setUser(null);
      setAccessToken(null);
      await logout();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user,initialized , accessToken, login, logout, refreshAccessToken, loading }}
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
