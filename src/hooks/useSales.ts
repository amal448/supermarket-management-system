import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SalesService } from "@/services/sales.service";
import { useAuth } from "@/app/providers/AuthProvider";
import { useState } from "react";

export function useSales(saleId?: string) {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const isDashboardAllowed =
    user?.role === "admin" || user?.role === "manager";

  // ✅ Run ONLY for admin / manager
  const getSummarySales = useQuery({
    queryKey: ["sales-summary"],
    queryFn: () => SalesService.getSalesSummary(),
    enabled: isDashboardAllowed,   // 🔥 THIS FIX
    refetchInterval: 1000 * 60 * 5,
  });

  const salesQuery = useQuery({
    queryKey: ["sales",page, search],
    queryFn: () => SalesService.getMySales(page, 10, search),
    placeholderData: keepPreviousData,
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
    setSearch
  };
}
