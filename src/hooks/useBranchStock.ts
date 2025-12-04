import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { BranchProduct } from "@/lib/types/product";
import { BranchInventoryService } from "@/services/branchInventory.service";

export function useBranchStock() {
    
  const queryClient = useQueryClient();

  // GET all products
const getbranchproductStock = useQuery<BranchProduct[]>({
  queryKey: ["branchStock"],
  queryFn: BranchInventoryService.getBranchStock,
});

  // ADD new product
  const addBranchMutation = useMutation({
    mutationFn: BranchInventoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branchStock"] });
    },
  });

  return {
    getbranchproductStock,
    addBranchMutation,
  };
}
