// src/hooks/useLogout.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import  {AuthService} from "@/services/auth.service";
import { tokenStore } from "@/lib/token";

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      tokenStore.setToken(null);
      qc.clear();
    },
    onError: () => {
      // still clear local state
      tokenStore.setToken(null);
      qc.clear();
    },
  });
}
