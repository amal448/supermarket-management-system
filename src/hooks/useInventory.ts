import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { InventoryService } from "@/services/inventory.service";
import type { Product, PaginatedProducts } from "@/lib/types/product";
import { useState } from "react";

export function useInventory() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const productsQuery = useQuery<PaginatedProducts>({
    queryKey: ["products", page, search],
    queryFn: () => InventoryService.getAll(page, 10, search),
    placeholderData: keepPreviousData,
  });

  const addProductMutation = useMutation({
    mutationFn: InventoryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const editProductMutation = useMutation({
    mutationFn: InventoryService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: InventoryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    productsQuery,
    addProductMutation,
    editProductMutation,
    deleteProductMutation,
    page,
    setPage,
    search,
    setSearch
  };
}
