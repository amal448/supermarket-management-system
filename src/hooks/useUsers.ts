// src/hooks/useUsers.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services/user.service";
import { useAuth } from "@/app/providers/AuthProvider";

export function useUsers() {
  const queryClient = useQueryClient();   // ✅ moved inside the hook
  const { user } = useAuth();


  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const allUsers = await UserService.getAll();
      return allUsers.filter(u => ["cashier", "staff"].includes(u.role));

    },
  });



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
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  // DELETE
  const deleteUserMutation = useMutation({
    mutationFn: async (id: any) => {
      
      return await UserService.deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    usersQuery,
    addUserMutation,
    updateUserMutation,
    deleteUserMutation
  };
}
