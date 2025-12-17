import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BranchInventoryService } from "@/services/branchInventory.service";

export function useBranchStock() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");

  const getbranchproductStock = useQuery({
    queryKey: ["branchStock", page, search],
    queryFn: () =>
      BranchInventoryService.getBranchStock({
        page,
        limit,
        search,
      }),
   placeholderData: (prev) => prev

  });

  const addBranchMutation = useMutation({
    mutationFn: BranchInventoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branchStock"] });
    },
  });

  return {
    getbranchproductStock,
    addBranchMutation,
    page,
    setPage,
    search,
    setSearch,
  };
}
