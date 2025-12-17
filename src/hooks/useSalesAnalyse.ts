import { useQuery } from "@tanstack/react-query";
import { SalesService } from "@/services/sales.service";
import type { SalesAnalysisResponse } from "@/lib/types/saleanalyse";

type Period = "daily" | "monthly" | "yearly";

export function useSalesAnalyse(
  branchId?: string,
  startDate?: string,
  endDate?: string,
  period: Period = "daily",
  enabled: boolean = true // optional flag to enable/disable auto-fetch
) {
const getSalesAnalysis = useQuery<SalesAnalysisResponse>({
  queryKey: ["sales-analytics", { branchId, startDate, endDate, period }],
  queryFn: () => SalesService.getSalesAnalysis(branchId, startDate, endDate, period),
  enabled: enabled && !!branchId,
});


  return { getSalesAnalysis, refetch: getSalesAnalysis.refetch };
}
