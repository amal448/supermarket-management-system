import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DiscountService } from "@/services/discount.service";
import type { DiscountEntity } from "@/lib/types/discount";

export function useDiscount() {

    const queryClient = useQueryClient();

    // GET all products
    const discountQuery = useQuery<DiscountEntity>({
        queryKey: ["discount"],
        queryFn: DiscountService.getAllDiscountOffers,
    });

    
    //   ADD new product
    const checkDiscountMutation = useMutation({
        mutationFn: DiscountService.applydiscount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["discount"] });
        },
    });
    const addDiscountMutation = useMutation({
        mutationFn: DiscountService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["discount"] });
        },
    });
    const editDiscountMutation = useMutation({
        mutationFn: DiscountService.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["discount"] });
        },
    });
    const deleteDiscountMutation = useMutation({
        mutationFn: DiscountService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["discount"] });
        },
    });

    return {
        discountQuery,
        addDiscountMutation,
        editDiscountMutation,
        deleteDiscountMutation,
        checkDiscountMutation
    };
}
