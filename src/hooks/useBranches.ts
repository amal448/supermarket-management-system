import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BranchService } from "@/services/branch.service";
import { UserService } from "@/services/user.service";

export function useBranches() {
  const queryClient = useQueryClient();

  const branchesQuery = useQuery({
    queryKey: ["branches"],
    queryFn: BranchService.getAll,
  });

  const managersQuery = useQuery({
    queryKey: ["managers"],
    queryFn: UserService.getManagers,
  });

  const addBranchMutation = useMutation({
    mutationFn: BranchService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });

  return {
    branchesQuery,
    managersQuery,
    addBranchMutation,
  };
}
