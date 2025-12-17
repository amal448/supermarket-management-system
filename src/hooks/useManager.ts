import { useAuth } from "@/app/providers/AuthProvider";
import { UserService } from "@/services/user.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useManagerMutation() {
  const queryClient = useQueryClient();
    const { user } = useAuth();
    
    const addUserMutation = useMutation({
    mutationFn: async (data: any) => {
      return await UserService.addUser(data, user?.role ?? "staff");
    },

    onSuccess: () => {
      // 🔥 Refresh UI after adding new user
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["managers"] });
    },
  });
// UPDATE
  const updateUserMutation = useMutation({
    mutationFn: async (data: any) => {
      return await UserService.editUser(data);
    },
    onSuccess: () => {
      // 🔥 Refresh managers list after update
      queryClient.invalidateQueries({ queryKey: ["managers"] });
    },
  });

  // DELETE
  const deleteUserMutation = useMutation({
    mutationFn: async (data: any) => {
      
      return await UserService.deleteUser(data._id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managers"] });
    },
  });
   // Only managers
  const managersQuery = useQuery({
    queryKey: ["managers"],
    queryFn: async () => {
      const allUsers = await UserService.getManagers();
      console.log(allUsers);
      
      return allUsers.filter((u) => u.role === "manager");
    },
  });
  const adminQuery = useQuery({
    queryKey: ["admin"],
    queryFn: async () => {
      const allUsers = await UserService.getManagers();
      console.log(allUsers);
      
      return allUsers.filter((u) => u.role === "admin");
    },
  });
  return { addUserMutation,updateUserMutation ,deleteUserMutation,adminQuery,    managersQuery,
};
}
