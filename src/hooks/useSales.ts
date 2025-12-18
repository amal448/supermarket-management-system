import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SalesService } from "@/services/sales.service";
// import type { CreatePaymentDTO, PaymentResponse } from "@/lib/types/payment";
import { useAuth } from "@/app/providers/AuthProvider";
import { useState } from "react";

export function useSales(saleId?: string) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  const { user } = useAuth();

  const isDashboardAllowed =
    user?.role === "admin" || user?.role === "manager";

  // ✅ Run ONLY for admin / manager
  const getSummarySales = useQuery({
    queryKey: ["sales-summary"],
    queryFn: () => SalesService.getSalesSummary({
        page,
        limit,
        search,
    }),
    enabled: isDashboardAllowed,   // 🔥 THIS FIX
    refetchInterval: 1000 * 60 * 5,
  });

  const salesQuery = useQuery({
    queryKey: ["sales"],
    queryFn: () => SalesService.getMySales(),
    enabled: !saleId,
  });

  const salesQueryDetails = useQuery({
    queryKey: ["sale", saleId],
    queryFn: () => SalesService.getMoreSalesDetails(saleId!),
    enabled: !!saleId,
  });

  const PaymentMutation = useMutation({
    mutationFn: SalesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["daily-sales"] });
    },
  });

  return {
    getSummarySales,
    salesQuery,
    salesQueryDetails,
    PaymentMutation,
    queryClient,
     page,
    setPage,
    search,
    setSearch,
  };
}
