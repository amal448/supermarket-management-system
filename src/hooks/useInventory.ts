import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InventoryService } from "@/services/inventory.service";
import type { Product } from "@/lib/types/product";

export function useInventory() {
    
  const queryClient = useQueryClient();

  // GET all products
  const productsQuery = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: InventoryService.getAll,
  });

  // ADD new product
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
    deleteProductMutation
  };
}
