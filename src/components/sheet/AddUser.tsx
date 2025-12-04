import { useUsers } from "@/hooks/useUsers";
import { SheetForm, type SheetField } from "./SheetForm";
import { useAuth } from "@/app/providers/AuthProvider";
import { useManagerMutation } from "@/hooks/useManager";

export function AddUser() {
  const { user } = useAuth();   // 👈 get logged-in user

    // 🔥 Switch hook based on role
  let addUserMutation: any;

  if (user?.role === "admin") {
    ({ addUserMutation } = useManagerMutation());
  } else if (user?.role === "manager") {
    ({ addUserMutation } = useUsers());
  } else {
    throw new Error("Unauthorized role");
  }

  const roleOptions = getRoleOptions(user?.role as string);

  const fields: SheetField[] = [
    { name: "username", label: "User Name", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "password", label: "Password", type: "password", required: true },

    {
      name: "role",
      label: "Role",
      type: "select",
      required: true,
      options: roleOptions,  // 👈 dynamic dropdown
    },
  ];

  const handleAddUser = (data: any) => {
    addUserMutation.mutate(data);
  };

  return (
    <SheetForm
      title="Add User"
      description="Fill in the user details"
      fields={fields}
      onSubmit={handleAddUser}
      triggerLabel="Add User"
    />
  );
}

// --- helper function ---
function getRoleOptions(currentRole: string) {
  if (currentRole === "admin") {
    return [
      { value: "manager", label: "Manager" },
    ];
  }

  if (currentRole === "manager") {
    return [
      { value: "cashier", label: "Cashier" },
      { value: "staff", label: "Staff" },
    ];
  }

  return [];
}
