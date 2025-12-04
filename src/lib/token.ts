// src/lib/token.ts
// Simple in-memory token store with listeners so axios and AuthProvider stay in sync.

type TokenListener = (token: string | null) => void;

let accessToken: string | null = null;
let listeners: TokenListener[] = [];

export const tokenStore = {
  getToken(): string | null {
    return accessToken;
  },

  setToken(token: string | null) {
    accessToken = token;
    listeners.forEach((l) => {
      try { l(accessToken); } catch (e) { /* ignore listener error */ }
    });
  },

  onChange(cb: TokenListener) {
    listeners.push(cb);
    return () => {
      listeners = listeners.filter((l) => l !== cb);
    };
  },
};
