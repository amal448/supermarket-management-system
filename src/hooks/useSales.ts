import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SalesService } from "@/services/sales.service";
import type { CreatePaymentDTO, PaymentResponse } from "@/lib/types/payment";

export function useSales(saleId?: string) {

  const queryClient = useQueryClient();

  // ✅ Daily sales for dashboard
  const getSummarySales = useQuery({
    queryKey: ["sales-summary"],
    queryFn: () => SalesService.getSalesSummary(),
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });

  // ✅ All sales list
  const salesQuery = useQuery({
    queryKey: ["sales"],
    queryFn: () => SalesService.getMySales(),
    enabled: !saleId,
  });

  // ✅ Sales Details by ID
  const salesQueryDetails = useQuery({
    queryKey: ["sale", saleId],
    queryFn: () => SalesService.getMoreSalesDetails(saleId!),
    enabled: !!saleId,
  });

  // ❗ Payment mutation
  const PaymentMutation = useMutation<PaymentResponse, Error, CreatePaymentDTO>({
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
    PaymentMutation
  };
}
